from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.agents.bank_account import (
    create_bank_account_service,
    delete_bank_account_service,
    get_bank_account_service,
    list_bank_accounts_service,
    update_bank_account_service,
)
from app.api.v1.schemas.bank_account import (
    BankAccountCreate,
    BankAccountRead,
    BankAccountUpdate,
)
from app.core.security import CurrentUser
from app.db.database import get_session

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
    return list_bank_accounts_service(session, current_user, limit=limit, offset=offset)


@router.get("/{bank_account_id}", response_model=BankAccountRead)
async def get_one_bank_account(
    bank_account_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    return get_bank_account_service(session, current_user, bank_account_id)


@router.post("/", response_model=BankAccountRead)
async def create_bank_account(
    data: BankAccountCreate,
    session: SessionDep,
    current_user: CurrentUser,
):
    return create_bank_account_service(session, current_user, data)


@router.patch("/{bank_account_id}", response_model=BankAccountRead)
async def update_bank_account(
    bank_account_id: UUID,
    data: BankAccountUpdate,
    session: SessionDep,
    current_user: CurrentUser,
):
    return update_bank_account_service(session, current_user, bank_account_id, data)


@router.delete("/{bank_account_id}")
async def delete_bank_account(
    bank_account_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    return delete_bank_account_service(session, current_user, bank_account_id)
