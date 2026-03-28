from typing import Annotated, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.ai.providers.ollama import get_embedding
from app.api.v1.schemas.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionUpdate,
)
from app.db.database import get_session
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
    query: str,
    limit=5,
):
    query_vector = await get_embedding(query, is_search=True)

    statement = (
        select(Transaction)
        .order_by(Transaction.description_vector.op("<=>")(query_vector))  # type: ignore
        .limit(limit)
    )

    results = session.exec(statement).all()

    return results


@router.post("/", response_model=Transaction)
async def create_transaction(
    data: TransactionCreate,
    session: Session = Depends(
        get_session,
    ),
):
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
):
    db_transaction = session.get(Transaction, transaction_id)

    if not db_transaction:
        raise HTTPException(404, "Transaction not found!")

    update_data = data.model_dump(exclude_unset=True)

    if "description" in update_data:
        new_vector = await get_embedding(update_data["description"], is_search=False)
        update_data["description"] = new_vector

    for key, value in update_data.items():
        setattr(db_transaction, key, value)

    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)

    return db_transaction
