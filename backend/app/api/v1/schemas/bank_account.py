from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel

from app.enums.account_type import AccountType


class BankAccountCreate(BaseModel):
    name: str
    balance: Decimal
    currency: str
    account_type: AccountType
    user_id: UUID
