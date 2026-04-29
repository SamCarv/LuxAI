from datetime import datetime
from decimal import Decimal
from typing import Any, Dict, Optional
from uuid import UUID
from pydantic import BaseModel
from sqlmodel import JSON, Field, SQLModel

from app.enums.transaction_type import TransactionType


class TransactionBase(SQLModel):
    description: str
    amount: Decimal
    type: TransactionType = Field(default=TransactionType.EXPENSE)
    category_id: UUID
    account_id: UUID
    metadata_info: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        sa_type=JSON,
    )


class TransactionRead(TransactionBase):
    id: UUID
    date: datetime


class TransactionCreate(BaseModel):
    description: str
    amount: Decimal
    type: TransactionType
    category_id: UUID
    account_id: UUID
    metadata_info: Optional[Dict[str, Any]] = {}


class TransactionUpdate(SQLModel):
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    type: Optional[TransactionType] = None
    category_id: Optional[UUID] = None
    account_id: Optional[UUID] = None
    metadata_info: Optional[Dict[str, Any]] = None
