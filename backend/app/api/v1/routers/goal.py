from typing import Annotated
from uuid import UUID

from app.agents.goal import (
    create_goal_service,
    delete_goal_service,
    get_goal_service,
    list_goals_service,
    update_goal_service,
)
from app.api.v1.schemas.goal import GoalCreate, GoalRead, GoalUpdate
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.security import CurrentUser
from app.db.database import get_session

router = APIRouter(
    prefix="/goal",
    tags=["goal"],
    responses={
        404: {"description": "Not found"},
    },
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=list[GoalRead])
async def get_all_goals(
    session: SessionDep,
    current_user: CurrentUser,
    limit: int = 5,
    offset: int = 0,
):
    return list_goals_service(session, current_user, limit=limit, offset=offset)


@router.get("/{goal_id}", response_model=GoalRead)
async def get_one_goal(goal_id: UUID, session: SessionDep, current_user: CurrentUser):
    return get_goal_service(session, current_user, goal_id)


@router.post("/", response_model=GoalRead)
async def create_goal(data: GoalCreate, session: SessionDep, current_user: CurrentUser):
    return create_goal_service(session, current_user, data)


@router.patch("/{goal_id}", response_model=GoalRead)
async def update_goal(
    goal_id: UUID,
    data: GoalUpdate,
    session: SessionDep,
    current_user: CurrentUser,
):
    return update_goal_service(session, current_user, goal_id, data)


@router.delete("/{goal_id}")
async def delete_goal(goal_id: UUID, session: SessionDep, current_user: CurrentUser):
    return delete_goal_service(session, current_user, goal_id)
