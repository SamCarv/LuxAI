from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.api.v1.schemas.bank_account import BankAccountCreate
from app.db.database import get_session
from app.models.bank_account import BankAccount
from app.models.category import Category


router = APIRouter(
    prefix="/bank_account",
    tags=["bank_account"],
    responses={404: {"descroption": "Not found"}},
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/")
async def get_bank_accounts(
    session: SessionDep,
    limit: int = 5,
    offset: int = 0,
):
    return session.exec(select(Category).offset(offset).limit(limit)).all()


@router.get("/{bank_account_id}")
async def get_one_bank_account(bank_account_id: UUID, session: SessionDep):
    bank_account = session.get(BankAccount, bank_account_id)

    if not bank_account:
        raise HTTPException(404, "Bank Account not found!")

    return bank_account


@router.post("/", response_model=BankAccount)
async def create_bank_account(data: BankAccountCreate, session: SessionDep):
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
