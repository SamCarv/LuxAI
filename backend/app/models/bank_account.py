from decimal import Decimal
from typing import TYPE_CHECKING
from sqlmodel import Relationship, SQLModel, Field
import sqlalchemy as sa

if TYPE_CHECKING:
    from .user import User


class BankAccount(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    balance: Decimal = Field(
        default=Decimal("0.00"), sa_column=sa.Column(sa.Numeric(12, 2))
    )
    currency: str = Field(default="USD")
    account_type: str = Field(default="Checking")

    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="accounts")
