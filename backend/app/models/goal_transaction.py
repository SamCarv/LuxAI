from datetime import datetime, timezone
from decimal import Decimal
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid7

from sqlmodel import Column, DateTime, Field, Numeric, Relationship, SQLModel, text

if TYPE_CHECKING:
    from .goal import Goal
    from .transaction import Transaction


class GoalTransaction(SQLModel, table=True):  # type: ignore
    __tablename__: str = "goal_transaction"

    id: UUID = Field(
        default_factory=uuid7,
        primary_key=True,
        index=True,
        nullable=False,
    )

    goal_id: UUID = Field(foreign_key="goal.id", nullable=False, index=True)
    transaction_id: UUID = Field(
        foreign_key="transaction.id", nullable=False, index=True
    )

    allocated_amount: Decimal = Field(
        sa_column=Column(Numeric(10, 2), nullable=False),
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("now()"),
        ),
    )

    goal: Optional["Goal"] = Relationship(back_populates="goal_transactions")
    transaction: Optional["Transaction"] = Relationship()
