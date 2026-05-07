from uuid import UUID

from fastapi import HTTPException
from pydantic_ai import Agent, RunContext
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from app.agents.deps import AgentDeps
from app.api.v1.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.models.category import Category
from app.models.user import User


def list_categories_service(
    session: Session,
    current_user: User,
    limit: int = 5,
    offset: int = 0,
) -> list[CategoryRead]:
    statement = (
        select(Category)
        .where(Category.user_id == current_user.id)
        .offset(offset)
        .limit(limit)
    )
    return session.exec(statement).all()


def get_category_service(
    session: Session, current_user: User, category_id: UUID
) -> CategoryRead:
    category = session.get(Category, category_id)

    if not category or category.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Category not found")

    return category


def create_category_service(
    session: Session, current_user: User, data: CategoryCreate
) -> CategoryRead:
    new_category = Category(
        name=data.name,
        color=data.color,
        icon=data.icon,
        user_id=current_user.id,
    )

    try:
        session.add(new_category)
        session.commit()
        session.refresh(new_category)
        return new_category
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=409,
            detail="Category name already exists for this user",
        )
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to save category: {str(e)}",
        )


def update_category_service(
    session: Session,
    current_user: User,
    category_id: UUID,
    data: CategoryUpdate,
) -> CategoryRead:
    category = session.get(Category, category_id)

    if not category or category.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Category not found")

    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(category, key, value)

    try:
        session.add(category)
        session.commit()
        session.refresh(category)
        return category
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=409,
            detail="Category name already exists for this user",
        )
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to update category: {str(e)}",
        )


def delete_category_service(
    session: Session, current_user: User, category_id: UUID
) -> dict[str, str]:
    category = session.get(Category, category_id)

    if not category or category.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Category not found")

    try:
        session.delete(category)
        session.commit()
        return {"detail": "Category deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to delete category: {str(e)}",
        )


def build_category_agent(model_name: str) -> Agent:
    agent = Agent(model_name, deps_type=AgentDeps)

    @agent.tool
    def list_categories(
        ctx: RunContext[AgentDeps], limit: int = 5, offset: int = 0
    ) -> list[CategoryRead]:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return list_categories_service(
            ctx.deps.session, current_user, limit=limit, offset=offset
        )

    @agent.tool
    def get_category(ctx: RunContext[AgentDeps], category_id: UUID) -> CategoryRead:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return get_category_service(ctx.deps.session, current_user, category_id)

    @agent.tool
    def create_category(
        ctx: RunContext[AgentDeps], data: CategoryCreate
    ) -> CategoryRead:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return create_category_service(ctx.deps.session, current_user, data)

    @agent.tool
    def update_category(
        ctx: RunContext[AgentDeps],
        category_id: UUID,
        data: CategoryUpdate,
    ) -> CategoryRead:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return update_category_service(
            ctx.deps.session, current_user, category_id, data
        )

    @agent.tool
    def delete_category(
        ctx: RunContext[AgentDeps], category_id: UUID
    ) -> dict[str, str]:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return delete_category_service(ctx.deps.session, current_user, category_id)

    return agent
