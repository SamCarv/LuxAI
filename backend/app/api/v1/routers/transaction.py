from typing import Annotated, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.ai.providers.ollama import get_embedding
from app.core.security import CurrentUser
from app.api.v1.schemas.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionUpdate,
)
from app.db.database import get_session
from app.models.bank_account import BankAccount
from app.models.category import Category
from app.models.transaction import Transaction


router = APIRouter(
    prefix="/transaction",
    tags=["transaction"],
    responses={404: {"description": "Not found"}},
)
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/search", response_model=List[TransactionRead])
async def search_transactions(
    session: SessionDep,
    current_user: CurrentUser,
    query: str,
    limit=5,
):
    account_ids = session.exec(
        select(BankAccount.id).where(BankAccount.user_id == current_user.id)
    ).all()

    if not account_ids:
        return []

    query_vector = await get_embedding(query, is_search=True)

    statement = (
        select(Transaction)
        .where(Transaction.account_id.in_(account_ids))  # type: ignore[attr-defined]
        .order_by(Transaction.description_vector.op("<=>")(query_vector))  # type: ignore
        .limit(limit)
    )

    results = session.exec(statement).all()

    return results


@router.post("/", response_model=TransactionRead)
async def create_transaction(
    data: TransactionCreate,
    current_user: CurrentUser,
    session: Session = Depends(
        get_session,
    ),
):
    account = session.get(BankAccount, data.account_id)
    category = session.get(Category, data.category_id)

    if not account or account.user_id != current_user.id:
        raise HTTPException(404, "Bank account not found!")

    if not category or category.user_id != current_user.id:
        raise HTTPException(404, "Category not found!")

    vector = await get_embedding(data.description, is_search=False)

    new_transaction = Transaction(
        description=data.description,
        amount=data.amount,
        type=data.type,
        category_id=data.category_id,
        account_id=data.account_id,
        metadata_info=data.metadata_info,
        description_vector=vector,
    )

    try:
        session.add(new_transaction)
        session.commit()
        session.refresh(new_transaction)
        return new_transaction
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to save transaction: {str(e)}",
        )


@router.patch("/{transaction_id}", response_model=TransactionRead)
async def update_transaction(
    transaction_id: UUID,
    data: TransactionUpdate,
    session: SessionDep,
    current_user: CurrentUser,
):
    transaction = session.get(Transaction, transaction_id)

    if not transaction:
        raise HTTPException(404, "Transaction not found!")

    owner_account = session.get(BankAccount, transaction.account_id)
    if not owner_account or owner_account.user_id != current_user.id:
        raise HTTPException(404, "Transaction not found!")

    update_data = data.model_dump(exclude_unset=True)

    if "description" in update_data:
        new_vector = await get_embedding(update_data["description"], is_search=False)
        update_data["description_vector"] = new_vector

    if "account_id" in update_data:
        updated_account = session.get(BankAccount, update_data["account_id"])
        if not updated_account or updated_account.user_id != current_user.id:
            raise HTTPException(404, "Bank account not found!")

    if "category_id" in update_data:
        updated_category = session.get(Category, update_data["category_id"])
        if not updated_category or updated_category.user_id != current_user.id:
            raise HTTPException(404, "Category not found!")

    for key, value in update_data.items():
        setattr(transaction, key, value)

    try:
        session.add(transaction)
        session.commit()
        session.refresh(transaction)
        return transaction
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to update transaction: {str(e)}",
        )

@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    transaction = session.get(Transaction, transaction_id)

    if not transaction:
        raise HTTPException(404, "Transaction not found!")

    owner_account = session.get(BankAccount, transaction.account_id)
    if not owner_account or owner_account.user_id != current_user.id:
        raise HTTPException(404, "Transaction not found!")

    try:
        session.delete(transaction)
        session.commit()
        return {"detail": "Transaction deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to delete transaction: {str(e)}",
        )