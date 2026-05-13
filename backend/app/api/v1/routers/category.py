from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.agents.category import (
    create_category_service,
    delete_category_service,
    get_category_service,
    list_categories_service,
    update_category_service,
)
from app.api.v1.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.core.security import CurrentUser
from app.db.database import get_session

router = APIRouter(
    prefix="/category",
    tags=["category"],
    responses={
        404: {"description": "Not found"},
    },
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=list[CategoryRead])
async def get_all_category(
    session: SessionDep,
    current_user: CurrentUser,
    limit: int = 5,
    offset: int = 0,
):
    return list_categories_service(session, current_user, limit=limit, offset=offset)


@router.get("/{category_id}", response_model=CategoryRead)
async def get_one_category(
    category_id: UUID, session: SessionDep, current_user: CurrentUser
):
    return get_category_service(session, current_user, category_id)


@router.post("/", response_model=CategoryRead)
async def create_category(
    data: CategoryCreate, session: SessionDep, current_user: CurrentUser
):
    return create_category_service(session, current_user, data)


@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(
    category_id: UUID,
    data: CategoryUpdate,
    session: SessionDep,
    current_user: CurrentUser,
):
    return update_category_service(session, current_user, category_id, data)


@router.delete("/{category_id}")
async def delete_category(
    category_id: UUID, session: SessionDep, current_user: CurrentUser
):
    return delete_category_service(session, current_user, category_id)
