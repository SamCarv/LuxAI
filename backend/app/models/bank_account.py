from decimal import Decimal
from typing import TYPE_CHECKING

import sqlalchemy as sa
from sqlmodel import Field, Relationship, SQLModel

from app.enums import AccountType, Currency

if TYPE_CHECKING:
    from .user import User


class BankAccount(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    balance: Decimal = Field(
        default=Decimal("0.00"), sa_column=sa.Column(sa.Numeric(12, 2))
    )
    currency: str = Field(default=Currency.USD)
    account_type: str = Field(default=AccountType.CHECKING)

    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="accounts")
