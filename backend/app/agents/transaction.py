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


async def search_transactions_service(
    session: Session,
    current_user: User,
    query: str,
    limit: int = 5,
) -> list[TransactionRead]:
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

    return results


async def create_transaction_service(
    session: Session,
    current_user: User,
    data: TransactionCreate,
) -> TransactionRead:
    account = session.get(BankAccount, data.account_id)
    category = session.get(Category, data.category_id)

    if not account or account.user_id != current_user.id:
        raise HTTPException(404, "Bank account not found!")

    if not category or category.user_id != current_user.id:
        raise HTTPException(404, "Category not found!")

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


async def update_transaction_service(
    session: Session,
    current_user: User,
    transaction_id: UUID,
    data: TransactionUpdate,
) -> TransactionRead:
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


def build_transaction_agent(model_name: str) -> Agent:
    agent = Agent(model_name, deps_type=AgentDeps)

    @agent.tool
    async def search_transactions(
        ctx: RunContext[AgentDeps], query: str, limit: int = 5
    ) -> list[TransactionRead]:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return await search_transactions_service(
            ctx.deps.session, current_user, query, limit=limit
        )

    @agent.tool
    async def create_transaction(
        ctx: RunContext[AgentDeps], data: TransactionCreate
    ) -> TransactionRead:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return await create_transaction_service(ctx.deps.session, current_user, data)

    @agent.tool
    async def update_transaction(
        ctx: RunContext[AgentDeps],
        transaction_id: UUID,
        data: TransactionUpdate,
    ) -> TransactionRead:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return await update_transaction_service(
            ctx.deps.session, current_user, transaction_id, data
        )

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
