# from datetime import datetime
from datetime import datetime
from typing import List
from sqlmodel import Relationship, SQLModel, Field


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    full_name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.now)

    accounts: List["BankAccount"] = Relationship(back_populates="user")
