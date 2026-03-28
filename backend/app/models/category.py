from operator import index
from typing import TYPE_CHECKING
from uuid import UUID, uuid7
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .transaction import Transaction
    from .user import User


class Category(SQLModel, table=True):
    __tablename__: str = "category"  # pyright: ignore[reportIncompatibleVariableOverride]

    id: UUID = Field(
        default_factory=uuid7,
        index=True,
        primary_key=True,
        nullable=False,
    )
    name: str = Field(index=True, unique=True)
    icon: str | None = Field(default=None)
    color: str | None = Field(default=None)

    user_id: UUID = Field(foreign_key="user.id", nullable=False)
    user: User = Relationship(back_populates="categories")

    transactions: list["Transaction"] = Relationship(back_populates="category")
