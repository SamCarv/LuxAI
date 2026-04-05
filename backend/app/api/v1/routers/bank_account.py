from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.api.v1.schemas.bank_account import BankAccountCreate, BankAccountRead, BankAccountUpdate
from app.core.security import CurrentUser
from app.db.database import get_session
from app.models.bank_account import BankAccount


router = APIRouter(
    prefix="/bank_account",
    tags=["bank_account"],
    responses={404: {"descroption": "Not found"}},
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=list[BankAccountRead])
async def get_bank_accounts(
    session: SessionDep,
    current_user: CurrentUser,
    limit: int = 5,
    offset: int = 0,
):
    try:
        bank_accounts = session.exec(
            select(BankAccount)
            .where(BankAccount.user_id == current_user.id)
            .offset(offset)
            .limit(limit)
        ).all()
        
        return bank_accounts
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error to fetch bank accounts: {str(e)}",
        )
    


@router.get("/{bank_account_id}", response_model=BankAccountRead)
async def get_one_bank_account(
    bank_account_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    bank_account = session.get(BankAccount, bank_account_id)

    if not bank_account or bank_account.user_id != current_user.id:
        raise HTTPException(404, "Bank Account not found!")

    return bank_account


@router.post("/", response_model=BankAccountRead)
async def create_bank_account(
    data: BankAccountCreate,
    session: SessionDep,
    current_user: CurrentUser,
):
    new_bank_account = BankAccount(
        name=data.name,
        balance=data.balance,
        currency=data.currency,
        account_type=data.account_type,
        user_id=current_user.id,
    )

    try:
        session.add(new_bank_account)
        session.commit()
        session.refresh(new_bank_account)
        return new_bank_account
    except Exception as e:
        session.rollback()
        raise HTTPException(
            500,
            f"Error to save bank account: {str(e)}",
        )


@router.patch("/{bank_account_id}", response_model=BankAccountRead)
async def update_bank_account(
    bank_account_id: UUID,
    data: BankAccountUpdate,
    session: SessionDep,
    current_user: CurrentUser,
):
    bank_account = session.get(BankAccount, bank_account_id)

    if not bank_account or bank_account.user_id != current_user.id:
        raise HTTPException(404, "Bank Account not found!")

    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(bank_account, key, value)

    try:
        session.add(bank_account)
        session.commit()
        session.refresh(bank_account)
        return bank_account
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to update bank account: {str(e)}",
        )


@router.delete("/{bank_account_id}")
async def delete_bank_account(
    bank_account_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    bank_account = session.get(BankAccount, bank_account_id)

    if not bank_account or bank_account.user_id != current_user.id:
        raise HTTPException(404, "Bank Account not found!")

    try:
        session.delete(bank_account)
        session.commit()
        return {"detail": "Bank Account deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to delete bank account: {str(e)}",
        )
