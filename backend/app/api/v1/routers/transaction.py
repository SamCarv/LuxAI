from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.agents.transaction import (
    create_transaction_service,
    delete_transaction_service,
    search_transactions_service,
    update_transaction_service,
)
from app.api.v1.schemas.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionUpdate,
)
from app.core.security import CurrentUser
from app.db.database import get_session

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
    return await search_transactions_service(session, current_user, query, limit=limit)


@router.post("/", response_model=TransactionRead)
async def create_transaction(
    data: TransactionCreate,
    current_user: CurrentUser,
    session: Session = Depends(
        get_session,
    ),
):
    return await create_transaction_service(session, current_user, data)


@router.patch("/{transaction_id}", response_model=TransactionRead)
async def update_transaction(
    transaction_id: UUID,
    data: TransactionUpdate,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await update_transaction_service(session, current_user, transaction_id, data)


@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await delete_transaction_service(session, current_user, transaction_id)
