from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.api.v1.schemas.bank_account import BankAccountCreate
from app.db.database import get_session
from app.models.bank_account import BankAccount


router = APIRouter(
    prefix="/bank_account",
    tags=["bank_account"],
    responses={404: {"descroption": "Not found"}},
)


@router.post("/", response_model=BankAccount)
async def create_bank_account(
    data: BankAccountCreate,
    session: Session = Depends(
        get_session,
    ),
):
    new_bank_account = BankAccount(
        name=data.name,
        balance=data.balance,
        currency=data.currency,
        account_type=data.account_type,
        user_id=data.user_id,
    )

    try:
        session.add(new_bank_account)
        session.commit()
        session.refresh(new_bank_account)
        return new_bank_account
    except Exception as e:
        return HTTPException(
            500,
            f"Error to save bank account: {str(e)}",
        )
