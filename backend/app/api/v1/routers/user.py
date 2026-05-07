from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.agents.user import (
    create_user_service,
    delete_user_service,
    get_user_service,
    list_users_service,
    update_user_service,
)
from app.api.v1.schemas.user import UserCreate, UserPublic, UserUpdate
from app.db.database import get_session

router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=list[UserPublic])
async def get_users(session: SessionDep, limit: int = 5, offset: int = 0):
    return list_users_service(session, limit=limit, offset=offset)


@router.get("/{user_id}", response_model=UserPublic)
async def get_user_by_id(user_id: UUID, session: SessionDep):
    return get_user_service(session, user_id)


@router.post("/", response_model=UserPublic)
async def create_user(
    data: UserCreate,
    session: Session = Depends(
        get_session,
    ),
):
    return create_user_service(session, data)


@router.patch("/{user_id}", response_model=UserPublic)
async def update_user(user_id: UUID, data: UserUpdate, session: SessionDep):
    return update_user_service(session, user_id, data)


@router.delete("/{user_id}")
async def delete_user(user_id: UUID, session: SessionDep):
    return delete_user_service(session, user_id)
