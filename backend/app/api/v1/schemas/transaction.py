from decimal import Decimal
from typing import Any, Dict, Optional
from pydantic import BaseModel

from app.enums.transaction_type import TransactionType


class TransactionCreate(BaseModel):
    description: str
    amount: Decimal
    type: TransactionType
    category_id: int
    account_id: int
    metadata_info: Optional[Dict[str, Any]] = {}
