from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.api.v1.schemas.user import UserCreate, UserPublic, UserUpdate
from app.core.security import encrypt_string, get_password_hash
from app.db.database import get_session
from app.models.user import User

router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=list[UserPublic])
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


@router.patch("/{user_id}", response_model=UserPublic)
async def update_user(user_id: UUID, data: UserUpdate, session: SessionDep):

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


@router.delete("/{user_id}")
async def delete_user(user_id: UUID, session: SessionDep):
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
