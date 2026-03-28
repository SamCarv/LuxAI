from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.api.v1.schemas.category import CategoryCreate
from app.db.database import get_session
from app.models.category import Category


router = APIRouter(
    prefix="/category",
    tags=["category"],
    responses={
        404: {"description": "Not found"},
    },
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/")
async def get_all_category(
    session: SessionDep,
    limit: int = 5,
    offset: int = 0,
):
    return session.exec(select(Category).offset(offset).limit(limit)).all()


@router.get("/{category_id}")
async def get_one_category(category_id: UUID, session: SessionDep):
    category = session.get(Category, category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category


@router.post("/", response_model=Category)
async def create_category(data: CategoryCreate, session: SessionDep):

    new_category = Category(
        name=data.name,
        color=data.color,
        icon=data.icon,
        user_id=data.user_id,
    )

    try:
        session.add(new_category)
        session.commit()
        session.refresh(new_category)
        return new_category
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to save category: {str(e)}",
        )
