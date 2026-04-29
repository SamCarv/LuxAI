# from datetime import datetime
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List
from uuid import UUID, uuid7
from sqlmodel import Relationship, Field

from app.api.v1.schemas.user import UserBase

if TYPE_CHECKING:
    from .bank_account import BankAccount
    from .category import Category


class User(UserBase, table=True):
    id: UUID = Field(
        default_factory=uuid7,
        index=True,
        primary_key=True,
        nullable=False,
    )
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    accounts: List["BankAccount"] = Relationship(back_populates="user")
    categories: List["Category"] = Relationship(back_populates="user")
