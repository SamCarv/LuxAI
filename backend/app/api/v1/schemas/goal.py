from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class GoalBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)


class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    target_amount: Decimal
    target_date: datetime


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_amount: Optional[Decimal] = None
    target_date: Optional[datetime] = None


class GoalRead(GoalBase):
    id: UUID
    user_id: UUID
    target_amount: Decimal
    current_amount: Decimal
    target_date: datetime
    created_at: datetime
    updated_at: datetime


class GoalTransactionCreate(BaseModel):
    goal_id: UUID
    transaction_id: UUID
    allocated_amount: Decimal


class GoalTransactionRead(BaseModel):
    id: UUID
    goal_id: UUID
    transaction_id: UUID
    allocated_amount: Decimal
    created_at: datetime


class GoalWithTransactions(GoalRead):
    transactions: list["GoalTransactionRead"] = []
