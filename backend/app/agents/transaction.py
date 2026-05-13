from decimal import Decimal
from typing import Optional
from uuid import UUID

from fastapi import HTTPException
from pydantic_ai import Agent, RunContext
from sqlmodel import Session, select

from app.agents.deps import AgentDeps
from app.api.v1.schemas.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionUpdate,
)
from app.core.security import decrypt_string
from app.enums.recurrence_frequency import RecurrenceFrequency
from app.enums.transaction_type import TransactionType
from app.models.bank_account import BankAccount
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.services.ai_service import get_embedding


def _resolve_api_key(current_user: User) -> str | None:
    return (
        decrypt_string(current_user.encrypted_google_api_key)
        if current_user.encrypted_google_api_key
        else None
    )


def _signed_amount(amount: Decimal, transaction_type: TransactionType) -> Decimal:
    return amount if transaction_type == TransactionType.INCOME else -amount


def _validate_recurrence(
    frequency: RecurrenceFrequency, recurrence_day: Optional[int]
) -> None:
    if frequency in {RecurrenceFrequency.NONE, RecurrenceFrequency.DAILY}:
        if recurrence_day is not None:
            raise HTTPException(
                status_code=400,
                detail="recurrence_day must be null for daily or none recurrence",
            )
        return

    if frequency == RecurrenceFrequency.WEEKLY:
        if recurrence_day is None or not 1 <= recurrence_day <= 7:
            raise HTTPException(
                status_code=400,
                detail="recurrence_day must be between 1 and 7 for weekly recurrence",
            )
        return

    if frequency == RecurrenceFrequency.MONTHLY:
        if recurrence_day is None or not 1 <= recurrence_day <= 31:
            raise HTTPException(
                status_code=400,
                detail="recurrence_day must be between 1 and 31 for monthly recurrence",
            )
        return


async def search_transactions_service(
    session: Session,
    current_user: User,
    query: str,
    limit: int = 5,
) -> list[Transaction]:
    account_ids = session.exec(
        select(BankAccount.id).where(BankAccount.user_id == current_user.id)
    ).all()

    if not account_ids:
        return []

    api_key = _resolve_api_key(current_user)
    query_vector = await get_embedding(
        query, is_search=True, provider=current_user.ai_provider, api_key=api_key
    )

    statement = (
        select(Transaction)
        .where(Transaction.account_id.in_(account_ids))  # type: ignore[attr-defined]
        .order_by(Transaction.description_vector.op("<=>")(query_vector))  # type: ignore
        .limit(limit)
    )

    results = session.exec(statement).all()

    return list(results)


async def list_transactions_service(
    session: Session,
    current_user: User,
    limit: int = 50,
    offset: int = 0,
    account_id: Optional[UUID] = None,
    category_id: Optional[UUID] = None,
) -> list[Transaction]:
    account_ids = session.exec(
        select(BankAccount.id).where(BankAccount.user_id == current_user.id)
    ).all()

    if not account_ids:
        return []

    if account_id:
        if account_id not in account_ids:
            raise HTTPException(404, "Bank account not found!")
        account_ids = [account_id]

    statement = (
        select(Transaction)
        .where(Transaction.account_id.in_(account_ids))  # type: ignore[attr-defined]
        .order_by(Transaction.date.desc())  # type: ignore[attr-defined]
        .offset(offset)
        .limit(limit)
    )

    if category_id is not None:
        category = session.get(Category, category_id)
        if not category or category.user_id != current_user.id:
            raise HTTPException(404, "Category not found!")
        statement = statement.where(Transaction.category_id == category_id)

    return list(session.exec(statement).all())


async def create_transaction_service(
    session: Session,
    current_user: User,
    data: TransactionCreate,
) -> Transaction:
    account = session.get(BankAccount, data.account_id)

    if not account or account.user_id != current_user.id:
        raise HTTPException(404, "Bank account not found!")

    category = None
    if data.category_id is not None:
        category = session.get(Category, data.category_id)
        if not category or category.user_id != current_user.id:
            raise HTTPException(404, "Category not found!")

    _validate_recurrence(data.recurrence_frequency, data.recurrence_day)

    api_key = _resolve_api_key(current_user)
    vector = await get_embedding(
        data.description,
        is_search=False,
        provider=current_user.ai_provider,
        api_key=api_key,
    )

    new_transaction = Transaction(
        description=data.description,
        amount=data.amount,
        type=data.type,
        category_id=data.category_id,
        account_id=data.account_id,
        recurrence_frequency=data.recurrence_frequency,
        recurrence_day=data.recurrence_day,
        metadata_info=data.metadata_info,
        description_vector=vector,
    )

    signed_amount = _signed_amount(data.amount, data.type)
    account.balance += signed_amount

    if category:
        new_transaction.category = category
    new_transaction.account = account

    try:
        session.add(account)
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


async def update_transaction_service(
    session: Session,
    current_user: User,
    transaction_id: UUID,
    data: TransactionUpdate,
) -> Transaction:
    transaction = session.get(Transaction, transaction_id)

    if not transaction:
        raise HTTPException(404, "Transaction not found!")

    owner_account = session.get(BankAccount, transaction.account_id)
    if not owner_account or owner_account.user_id != current_user.id:
        raise HTTPException(404, "Transaction not found!")

    update_data = data.model_dump(exclude_unset=True)

    if "description" in update_data:
        api_key = _resolve_api_key(current_user)
        new_vector = await get_embedding(
            update_data["description"],
            is_search=False,
            provider=current_user.ai_provider,
            api_key=api_key,
        )
        update_data["description_vector"] = new_vector

    updated_account = owner_account
    if "account_id" in update_data:
        updated_account = session.get(BankAccount, update_data["account_id"])
        if not updated_account or updated_account.user_id != current_user.id:
            raise HTTPException(404, "Bank account not found!")

    updated_category = None
    if "category_id" in update_data and update_data["category_id"] is not None:
        updated_category = session.get(Category, update_data["category_id"])
        if not updated_category or updated_category.user_id != current_user.id:
            raise HTTPException(404, "Category not found!")

    if "recurrence_frequency" in update_data and "recurrence_day" not in update_data:
        if update_data["recurrence_frequency"] in {
            RecurrenceFrequency.NONE,
            RecurrenceFrequency.DAILY,
        }:
            update_data["recurrence_day"] = None

    new_frequency = update_data.get(
        "recurrence_frequency", transaction.recurrence_frequency
    )
    new_day = update_data.get("recurrence_day", transaction.recurrence_day)
    _validate_recurrence(new_frequency, new_day)

    old_signed = _signed_amount(transaction.amount, transaction.type)
    new_amount = update_data.get("amount", transaction.amount)
    new_type = update_data.get("type", transaction.type)
    new_signed = _signed_amount(new_amount, new_type)

    if updated_account.id == owner_account.id:
        owner_account.balance += new_signed - old_signed
        session.add(owner_account)
    else:
        owner_account.balance -= old_signed
        updated_account.balance += new_signed
        session.add(owner_account)
        session.add(updated_account)

    for key, value in update_data.items():
        setattr(transaction, key, value)

    if updated_account.id != owner_account.id:
        transaction.account = updated_account

    if "category_id" in update_data:
        transaction.category = updated_category if updated_category else None

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


async def delete_transaction_service(
    session: Session,
    current_user: User,
    transaction_id: UUID,
) -> dict[str, str]:
    transaction = session.get(Transaction, transaction_id)

    if not transaction:
        raise HTTPException(404, "Transaction not found!")

    owner_account = session.get(BankAccount, transaction.account_id)
    if not owner_account or owner_account.user_id != current_user.id:
        raise HTTPException(404, "Transaction not found!")

    signed_amount = _signed_amount(transaction.amount, transaction.type)
    owner_account.balance -= signed_amount

    try:
        session.add(owner_account)
        session.delete(transaction)
        session.commit()
        return {"detail": "Transaction deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error to delete transaction: {str(e)}",
        )


def build_transaction_agent(model_name: str) -> Agent[AgentDeps, str]:
    agent = Agent(model_name, deps_type=AgentDeps)

    @agent.tool
    async def list_transactions(
        ctx: RunContext[AgentDeps],
        limit: int = 50,
        offset: int = 0,
        account_id: Optional[UUID] = None,
        category_id: Optional[UUID] = None,
    ) -> list[TransactionRead]:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        transactions = await list_transactions_service(
            ctx.deps.session,
            current_user,
            limit=limit,
            offset=offset,
            account_id=account_id,
            category_id=category_id,
        )
        return [TransactionRead.model_validate(tx) for tx in transactions]

    @agent.tool
    async def search_transactions(
        ctx: RunContext[AgentDeps], query: str, limit: int = 5
    ) -> list[TransactionRead]:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        transactions = await search_transactions_service(
            ctx.deps.session, current_user, query, limit=limit
        )
        return [TransactionRead.model_validate(tx) for tx in transactions]

    @agent.tool
    async def create_transaction(
        ctx: RunContext[AgentDeps], data: TransactionCreate
    ) -> TransactionRead:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        transaction = await create_transaction_service(
            ctx.deps.session, current_user, data
        )
        return TransactionRead.model_validate(transaction)

    @agent.tool
    async def update_transaction(
        ctx: RunContext[AgentDeps],
        transaction_id: UUID,
        data: TransactionUpdate,
    ) -> TransactionRead:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        transaction = await update_transaction_service(
            ctx.deps.session, current_user, transaction_id, data
        )
        return TransactionRead.model_validate(transaction)

    @agent.tool
    async def delete_transaction(
        ctx: RunContext[AgentDeps], transaction_id: UUID
    ) -> dict[str, str]:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return await delete_transaction_service(
            ctx.deps.session, current_user, transaction_id
        )

    return agent
