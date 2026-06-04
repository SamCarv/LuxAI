from datetime import datetime
from decimal import Decimal
from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel
from sqlmodel import JSON, Field, SQLModel

from app.enums.recurrence_frequency import RecurrenceFrequency
from app.enums.transaction_status import TransactionStatus
from app.enums.transaction_type import TransactionType


class TransactionBase(SQLModel):
    description: str
    amount: Decimal
    type: TransactionType = Field(default=TransactionType.EXPENSE)
    category_id: Optional[UUID] = Field(default=None)
    account_id: UUID
    recurrence_frequency: RecurrenceFrequency = Field(
        default=RecurrenceFrequency.NONE,
    )
    recurrence_day: Optional[int] = None
    metadata_info: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        sa_type=JSON,
    )


class TransactionRead(TransactionBase):
    id: UUID
    date: datetime
    status: TransactionStatus
    failure_reason: Optional[str] = None


class TransactionCreate(BaseModel):
    description: str
    amount: Decimal
    type: TransactionType
    category_id: Optional[UUID] = None
    account_id: UUID
    recurrence_frequency: RecurrenceFrequency = RecurrenceFrequency.NONE
    recurrence_day: Optional[int] = None
    metadata_info: Optional[Dict[str, Any]] = Field(default_factory=dict)
    status: TransactionStatus = TransactionStatus.SUCCESS
    failure_reason: Optional[str] = None


class TransactionUpdate(SQLModel):
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    type: Optional[TransactionType] = None
    category_id: Optional[UUID] = None
    account_id: Optional[UUID] = None
    recurrence_frequency: Optional[RecurrenceFrequency] = None
    recurrence_day: Optional[int] = None
    metadata_info: Optional[Dict[str, Any]] = None
    status: Optional[TransactionStatus] = None
    failure_reason: Optional[str] = None
