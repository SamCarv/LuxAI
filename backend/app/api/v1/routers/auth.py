from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from app.api.v1.schemas.auth import Token
from app.api.v1.schemas.user import UserPublic
from app.core.security import CurrentUser, authenticate_user, create_access_token
from app.db.database import get_session

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep,
):
    user = authenticate_user(session, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.id)

    return Token(
        access_token=access_token,
        token_type="bearer",
    )


@router.get("/me", response_model=UserPublic)
async def read_current_user(current_user: CurrentUser):
    return current_user
