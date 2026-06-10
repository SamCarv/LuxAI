from uuid import UUID

from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    full_name: str
    email: str = Field(unique=True, index=True)
    is_active: bool = Field(default=True)
    ai_provider: str = Field(default="google")


class UserUpdate(SQLModel):
    full_name: str | None = None
    email: str | None = None
    is_active: bool | None = None
    password: str | None = None
    ai_provider: str | None = None
    google_api_key: str | None = None


class UserCreate(UserBase):
    password: str


class UserPublic(UserBase):
    id: UUID
