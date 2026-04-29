from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from app.api.v1.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.core.security import CurrentUser
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


@router.get("/", response_model=list[CategoryRead])
async def get_all_category(
    session: SessionDep,
    current_user: CurrentUser,
    limit: int = 5,
    offset: int = 0,
):
    statement = (
        select(Category)
        .where(Category.user_id == current_user.id)
        .offset(offset)
        .limit(limit)
    )
    return session.exec(statement).all()


@router.get("/{category_id}", response_model=CategoryRead)
async def get_one_category(category_id: UUID, session: SessionDep, current_user: CurrentUser):
    category = session.get(Category, category_id)

    if not category or category.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Category not found")

    return category


@router.post("/", response_model=CategoryRead)
async def create_category(data: CategoryCreate, session: SessionDep, current_user: CurrentUser):

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

@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(
    category_id: UUID,
    data: CategoryUpdate,
    session: SessionDep,
    current_user: CurrentUser,
):
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
        
@router.delete("/{category_id}")
async def delete_category(category_id: UUID, session: SessionDep, current_user: CurrentUser):
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