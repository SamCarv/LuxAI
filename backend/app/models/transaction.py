from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid7
from zoneinfo import ZoneInfo

from pgvector.sqlalchemy import Vector
from sqlmodel import Field, Relationship

from app.api.v1.schemas.transaction import TransactionBase
from app.enums.transaction_status import TransactionStatus

if TYPE_CHECKING:
    from .bank_account import BankAccount
    from .category import Category

from sqlmodel import (
    Column,
    DateTime,
    Numeric,
    text,
)


class Transaction(TransactionBase, table=True):
    __tablename__: str = "transaction"  # pyright: ignore[reportIncompatibleVariableOverride]

    id: UUID = Field(
        default_factory=uuid7,
        primary_key=True,
        index=True,
        nullable=False,
    )

    amount: Decimal = Field(sa_column=Column(Numeric(10, 2), nullable=False))

    date: datetime = Field(
        default_factory=lambda: datetime.now(ZoneInfo("America/Sao_Paulo")),
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("now()"),
        ),
    )

    category_id: Optional[UUID] = Field(
        default=None,
        foreign_key="category.id",
        nullable=True,
    )
    account_id: UUID = Field(foreign_key="bank_account.id")

    recurrence_parent_id: Optional[UUID] = Field(
        default=None,
        foreign_key="transaction.id",
        nullable=True,
        index=True,
    )

    description_vector: Optional[List[float]] = Field(
        default=None,
        sa_column=Column(Vector(768), nullable=True),
    )

    status: TransactionStatus = Field(
        default=TransactionStatus.SUCCESS,
        nullable=False,
    )
    failure_reason: Optional[str] = Field(default=None, nullable=True)

    category: Optional["Category"] = Relationship(back_populates="transactions")
    account: Optional["BankAccount"] = Relationship(back_populates="transactions")
