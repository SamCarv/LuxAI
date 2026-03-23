from decimal import Decimal
from typing import TYPE_CHECKING, List

import sqlalchemy as sa
from sqlmodel import Field, Relationship, SQLModel

from app.enums import AccountType, Currency

if TYPE_CHECKING:
    from .user import User
    from .transaction import Transaction


class BankAccount(SQLModel, table=True):
    __tablename__: str = "bank_account"
    id: int | None = Field(default=None, primary_key=True)
    name: str
    balance: Decimal = Field(
        default=Decimal("0.00"), sa_column=sa.Column(sa.Numeric(12, 2))
    )
    currency: str = Field(default=Currency.USD)
    account_type: str = Field(default=AccountType.CHECKING)

    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="accounts")
    transactions: List["Transaction"] = Relationship(back_populates="account")
