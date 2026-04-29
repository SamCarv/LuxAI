from uuid import UUID
from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    full_name: str
    email: str = Field(unique=True, index=True)
    is_active: bool = Field(default=True)


class UserCreate(UserBase):
    password: str


class UserPublic(UserBase):
    id: UUID
