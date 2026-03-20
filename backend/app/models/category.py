from typing import TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .transaction import Transaction
    from .user import User


class Category(SQLModel, table=True):
    __tablename__: str = "category"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    icon: str | None = Field(default=None)
    color: str | None = Field(default=None)

    user_id: int = Field(foreign_key="user.id", nullable=False)
    user: User = Relationship(back_populates="categories")

    transactions: list["Transaction"] = Relationship(back_populates="category")
