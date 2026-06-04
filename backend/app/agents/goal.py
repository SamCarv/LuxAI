from uuid import UUID

from fastapi import HTTPException
from pydantic_ai import Agent, RunContext
from sqlmodel import Session, select

from app.agents.deps import AgentDeps
from app.api.v1.schemas.goal import GoalCreate, GoalRead, GoalUpdate
from app.models.goal import Goal
from app.models.user import User


def list_goals_service(
    session: Session,
    current_user: User,
    limit: int = 5,
    offset: int = 0,
) -> list[Goal]:
    statement = (
        select(Goal).where(Goal.user_id == current_user.id).offset(offset).limit(limit)
    )
    return list(session.exec(statement).all())


def get_goal_service(session: Session, current_user: User, goal_id: UUID) -> Goal:
    statement = select(Goal).where(Goal.id == goal_id, Goal.user_id == current_user.id)
    goal = session.exec(statement).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    return goal


def create_goal_service(session: Session, current_user: User, data: GoalCreate) -> Goal:
    new_goal = Goal(
        name=data.name,
        target_amount=data.target_amount,
        current_amount=data.initial_amount,
        deadline=data.deadline,
        user_id=current_user.id,
    )

    session.add(new_goal)
    session.commit()
    session.refresh(new_goal)
    return new_goal


def update_goal_service(
    session: Session,
    current_user: User,
    goal_id: UUID,
    data: GoalUpdate,
) -> Goal:
    goal = session.get(Goal, goal_id)

    if not goal or goal.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Goal not found")

    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(goal, key, value)

    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


def delete_goal_service(
    session: Session, current_user: User, goal_id: UUID
) -> dict[str, str]:
    goal = session.get(Goal, goal_id)

    if not goal or goal.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Goal not found")

    session.delete(goal)
    session.commit()
    return {"detail": "Goal deleted successfully"}


def build_goal_agent(model_name: str) -> Agent[AgentDeps, str]:
    agent = Agent(model_name, deps_type=AgentDeps)

    @agent.tool
    def list_goals(
        ctx: RunContext[AgentDeps], limit: int = 5, offset: int = 0
    ) -> list[GoalRead]:
        """Lista metas financeiras do usuário."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        goals = list_goals_service(
            ctx.deps.session, current_user, limit=limit, offset=offset
        )
        return [GoalRead.model_validate(goal) for goal in goals]

    @agent.tool
    def get_goal(ctx: RunContext[AgentDeps], goal_id: UUID) -> GoalRead:
        """Busca uma meta financeira por ID."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        goal = get_goal_service(ctx.deps.session, current_user, goal_id)
        return GoalRead.model_validate(goal)

    @agent.tool
    def create_goal(ctx: RunContext[AgentDeps], data: GoalCreate) -> GoalRead:
        """Cria uma meta financeira."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        goal = create_goal_service(ctx.deps.session, current_user, data)
        return GoalRead.model_validate(goal)

    @agent.tool
    def update_goal(
        ctx: RunContext[AgentDeps],
        goal_id: UUID,
        data: GoalUpdate,
    ) -> GoalRead:
        """Atualiza uma meta financeira."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        goal = update_goal_service(ctx.deps.session, current_user, goal_id, data)
        return GoalRead.model_validate(goal)

    @agent.tool
    def delete_goal(ctx: RunContext[AgentDeps], goal_id: UUID) -> dict[str, str]:
        """Remove uma meta financeira."""
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return delete_goal_service(ctx.deps.session, current_user, goal_id)

    return agent
