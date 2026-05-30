from datetime import datetime, timezone
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid7

from sqlmodel import Column, DateTime, Field, Numeric, Relationship, text

from app.api.v1.schemas.goal import GoalBase

if TYPE_CHECKING:
    from .goal_transaction import GoalTransaction


class Goal(GoalBase, table=True):
    __tablename__: str = "goal"

    id: UUID = Field(
        default_factory=uuid7,
        primary_key=True,
        index=True,
        nullable=False,
    )

    user_id: UUID = Field(foreign_key="user_account.id", nullable=False, index=True)

    target_amount: Decimal = Field(sa_column=Column(Numeric(10, 2), nullable=False))

    current_amount: Decimal = Field(
        default=Decimal("0.00"),
        sa_column=Column(Numeric(10, 2), nullable=False, default=Decimal("0.00")),
    )

    target_date: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
        ),
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("now()"),
        ),
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("now()"),
        ),
    )

    goal_transactions: List["GoalTransaction"] = Relationship(back_populates="goal")
