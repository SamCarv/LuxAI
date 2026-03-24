from pydantic import BaseModel

from app.models.user import UserBase


class UserCreate(UserBase):
    password: str


class UserPublic(UserBase):
    id: int
