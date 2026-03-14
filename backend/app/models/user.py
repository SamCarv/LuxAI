# from datetime import datetime
from datetime import datetime
from typing import TYPE_CHECKING, List
from sqlmodel import Relationship, SQLModel, Field

if TYPE_CHECKING:
    from .bank_account import BankAccount


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    full_name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    accounts: List[BankAccount] = Relationship(back_populates="user")
