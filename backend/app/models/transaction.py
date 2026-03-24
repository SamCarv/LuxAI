import numpy as np

from datetime import datetime, timezone
from decimal import Decimal
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from pgvector.sqlalchemy import Vector
from pydantic import field_serializer
from sqlalchemy import JSON, Column, DateTime, Numeric, text
from sqlmodel import Field, Relationship, SQLModel

from app.enums.transaction_type import TransactionType

if TYPE_CHECKING:
    from .bank_account import BankAccount
    from .category import Category


class Transaction(SQLModel, table=True):
    __tablename__: str = "transaction"
    id: Optional[int] = Field(default=None, primary_key=True)
    description: str

    amount: Decimal = Field(sa_column=Column(Numeric(10, 2), nullable=False))

    date: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("now()"),
        ),
    )

    type: TransactionType = Field(default=TransactionType.EXPENSE, nullable=False)

    category_id: int = Field(foreign_key="category.id", nullable=False)
    account_id: int = Field(foreign_key="bank_account.id", nullable=False)

    description_vector: Optional[List[float]] = Field(
        default=None,
        sa_column=Column(Vector(768), nullable=True),
    )

    @field_serializer("description_vector")
    @classmethod
    def validate_vector(cls, v):
        if isinstance(v, np.ndarray):
            return v.tolist()
        return v

    metadata_info: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=True, default=dict),
    )

    category: Optional["Category"] = Relationship(back_populates="transactions")
    account: Optional["BankAccount"] = Relationship(back_populates="transactions")
