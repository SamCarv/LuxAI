from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.api.v1.schemas.user import UserCreate, UserPublic
from app.core.security import get_password_hash
from app.db.database import get_session
from app.models.user import User


router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)


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
