from uuid import UUID

from fastapi import HTTPException
from pydantic_ai import Agent, RunContext
from sqlmodel import Session, select

from app.agents.deps import AgentDeps
from app.api.v1.schemas.user import UserCreate, UserPublic, UserUpdate
from app.core.security import encrypt_string, get_password_hash
from app.models.user import User


def list_users_service(
    session: Session, limit: int = 5, offset: int = 0
) -> list[UserPublic]:
    users = session.exec(select(User).offset(offset).limit(limit)).all()

    if not users:
        raise HTTPException(404, "No users found")

    return users


def get_user_service(session: Session, user_id: UUID) -> UserPublic:
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(404, "User not found!")

    return user


def create_user_service(session: Session, data: UserCreate) -> UserPublic:
    hashed_pass = get_password_hash(data.password)
    new_user = User(
        full_name=data.full_name,
        email=data.email,
        hashed_password=hashed_pass,
    )

    try:
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to save user: {str(e)}",
        )


def update_user_service(
    session: Session, user_id: UUID, data: UserUpdate
) -> UserPublic:
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(404, "User not found!")

    update_data = data.model_dump(exclude_unset=True)

    if "password" in update_data:
        new_vector = get_password_hash(update_data["password"])
        update_data["hashed_password"] = new_vector
        del update_data["password"]

    if "google_api_key" in update_data:
        if update_data["google_api_key"]:
            update_data["encrypted_google_api_key"] = encrypt_string(
                update_data["google_api_key"]
            )
        else:
            update_data["encrypted_google_api_key"] = None
        del update_data["google_api_key"]

    for key, value in update_data.items():
        setattr(user, key, value)

    try:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to update user: {str(e)}",
        )


def delete_user_service(session: Session, user_id: UUID) -> dict[str, str]:
    user = session.get(User, user_id)

    try:
        session.delete(user)
        session.commit()
        session.refresh(user)
        return {"detail": "User deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to delete user: {str(e)}",
        )


def build_user_agent(model_name: str) -> Agent:
    agent = Agent(model_name, deps_type=AgentDeps)

    @agent.tool
    def list_users(
        ctx: RunContext[AgentDeps], limit: int = 5, offset: int = 0
    ) -> list[UserPublic]:
        return list_users_service(ctx.deps.session, limit=limit, offset=offset)

    @agent.tool
    def get_user(ctx: RunContext[AgentDeps], user_id: UUID) -> UserPublic:
        return get_user_service(ctx.deps.session, user_id)

    @agent.tool
    def create_user(ctx: RunContext[AgentDeps], data: UserCreate) -> UserPublic:
        return create_user_service(ctx.deps.session, data)

    @agent.tool
    def update_user(
        ctx: RunContext[AgentDeps], user_id: UUID, data: UserUpdate
    ) -> UserPublic:
        return update_user_service(ctx.deps.session, user_id, data)

    @agent.tool
    def delete_user(ctx: RunContext[AgentDeps], user_id: UUID) -> dict[str, str]:
        return delete_user_service(ctx.deps.session, user_id)

    return agent
