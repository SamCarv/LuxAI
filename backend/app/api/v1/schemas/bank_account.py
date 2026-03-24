from decimal import Decimal
from pydantic import BaseModel

from app.enums.account_type import AccountType


class BankAccountCreate(BaseModel):
    name: str
    balance: Decimal
    currency: str
    account_type: AccountType
    user_id: int
