from datetime import date
from decimal import Decimal
from typing import TYPE_CHECKING
from uuid import UUID, uuid7

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class Goal(SQLModel, table=True):
    __tablename__: str = "goal"  # pyright: ignore[reportIncompatibleVariableOverride]

    id: UUID = Field(
        default_factory=uuid7,
        index=True,
        primary_key=True,
        nullable=False,
    )
    name: str = Field(index=True)
    target_amount: Decimal = Field(
        default=Decimal("0"), max_digits=14, decimal_places=2
    )
    current_amount: Decimal = Field(
        default=Decimal("0"), max_digits=14, decimal_places=2
    )
    deadline: date | None = Field(default=None)

    user_id: UUID = Field(foreign_key="user.id", nullable=False)
    user: "User" = Relationship(back_populates="goals")
