# from datetime import datetime
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List
from sqlmodel import Relationship, SQLModel, Field

if TYPE_CHECKING:
    from .bank_account import BankAccount
    from .category import Category


class UserBase(SQLModel):
    full_name: str
    email: str = Field(unique=True, index=True)
    is_active: bool = Field(default=True)


class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    accounts: List["BankAccount"] = Relationship(back_populates="user")
    categories: List["Category"] = Relationship(back_populates="user")
