from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.api.v1.schemas.transaction import TransactionRead
from app.enums.category_icon import CategoryIcon


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[CategoryIcon] = None
    color: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: UUID
    user_id: UUID
    transactions: list[TransactionRead] = Field(default_factory=list)


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[CategoryIcon] = None
    color: Optional[str] = None
