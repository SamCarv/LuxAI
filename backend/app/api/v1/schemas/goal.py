from datetime import date
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class GoalBase(BaseModel):
    name: str
    target_amount: Decimal = Field(
        default=Decimal("0"), max_digits=14, decimal_places=2
    )
    current_amount: Decimal = Field(
        default=Decimal("0"), max_digits=14, decimal_places=2
    )
    deadline: Optional[date] = None


class GoalCreate(BaseModel):
    name: str
    target_amount: Decimal = Field(..., max_digits=14, decimal_places=2)
    initial_amount: Decimal = Field(
        default=Decimal("0"), max_digits=14, decimal_places=2
    )
    deadline: Optional[date] = None


class GoalRead(GoalBase):
    id: UUID
    user_id: UUID


class GoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[Decimal] = Field(
        default=None, max_digits=14, decimal_places=2
    )
    current_amount: Optional[Decimal] = Field(
        default=None, max_digits=14, decimal_places=2
    )
    deadline: Optional[date] = None
