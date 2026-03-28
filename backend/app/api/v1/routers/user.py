from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.api.v1.schemas.user import UserCreate, UserPublic
from app.core.security import get_password_hash
from app.db.database import get_session
from app.models.user import User


router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=UserPublic)
async def get_users(session: SessionDep, limit: int = 5, offset: int = 0):

    users = session.exec(select(User).offset(offset).limit(limit)).all()

    if not users:
        raise HTTPException(404, "No users found")

    return users


@router.get("/{user_id}", response_model=UserPublic)
async def get_user_by_id(user_id: UUID, session: SessionDep):

    user = session.get(User, user_id)

    if not user:
        raise HTTPException(404, "User not found!")

    return user


@router.post("/", response_model=UserPublic)
async def create_user(
    data: UserCreate,
    session: Session = Depends(
        get_session,
    ),
):

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
