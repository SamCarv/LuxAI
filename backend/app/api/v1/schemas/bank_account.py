from decimal import Decimal
from typing import Optional
from uuid import UUID
from pydantic import BaseModel

from app.enums.account_type import AccountType


class BankAccountBase(BaseModel):
    name: str
    balance: Decimal
    currency: str
    account_type: AccountType


class BankAccountCreate(BankAccountBase):
    pass


class BankAccountRead(BankAccountBase):
    id: UUID
    user_id: UUID


class BankAccountUpdate(BaseModel):
    name: Optional[str] = None
    balance: Optional[Decimal] = None
    currency: Optional[str] = None
    account_type: Optional[AccountType] = None
