from typing import TYPE_CHECKING
from uuid import UUID, uuid7

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel

from app.enums.category_icon import CategoryIcon

if TYPE_CHECKING:
    from .transaction import Transaction
    from .user import User


class Category(SQLModel, table=True):
    __tablename__: str = "category"  # pyright: ignore[reportIncompatibleVariableOverride]
    __table_args__ = (
        UniqueConstraint("user_id", "name", name="uq_category_user_name"),
    )

    id: UUID = Field(
        default_factory=uuid7,
        index=True,
        primary_key=True,
        nullable=False,
    )
    name: str = Field(index=True)
    description: str | None = Field(default=None)
    icon: CategoryIcon | None = Field(default=None)
    color: str | None = Field(default=None)

    user_id: UUID = Field(foreign_key="user.id", nullable=False)
    user: User = Relationship(back_populates="categories")

    transactions: list["Transaction"] = Relationship(back_populates="category")
