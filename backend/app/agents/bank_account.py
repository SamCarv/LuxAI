from uuid import UUID

from fastapi import HTTPException
from pydantic_ai import Agent, RunContext
from sqlmodel import Session, select

from app.agents.deps import AgentDeps
from app.api.v1.schemas.bank_account import (
    BankAccountCreate,
    BankAccountRead,
    BankAccountUpdate,
)
from app.models.bank_account import BankAccount
from app.models.user import User


def list_bank_accounts_service(
    session: Session,
    current_user: User,
    limit: int = 5,
    offset: int = 0,
) -> list[BankAccountRead]:
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


def get_bank_account_service(
    session: Session, current_user: User, bank_account_id: UUID
) -> BankAccountRead:
    bank_account = session.get(BankAccount, bank_account_id)

    if not bank_account or bank_account.user_id != current_user.id:
        raise HTTPException(404, "Bank Account not found!")

    return bank_account


def create_bank_account_service(
    session: Session, current_user: User, data: BankAccountCreate
) -> BankAccountRead:
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


def update_bank_account_service(
    session: Session,
    current_user: User,
    bank_account_id: UUID,
    data: BankAccountUpdate,
) -> BankAccountRead:
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


def delete_bank_account_service(
    session: Session, current_user: User, bank_account_id: UUID
) -> dict[str, str]:
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


def build_bank_account_agent(model_name: str) -> Agent:
    agent = Agent(model_name, deps_type=AgentDeps)

    @agent.tool
    def list_bank_accounts(
        ctx: RunContext[AgentDeps], limit: int = 5, offset: int = 0
    ) -> list[BankAccountRead]:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return list_bank_accounts_service(
            ctx.deps.session, current_user, limit=limit, offset=offset
        )

    @agent.tool
    def get_bank_account(
        ctx: RunContext[AgentDeps], bank_account_id: UUID
    ) -> BankAccountRead:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return get_bank_account_service(ctx.deps.session, current_user, bank_account_id)

    @agent.tool
    def create_bank_account(
        ctx: RunContext[AgentDeps], data: BankAccountCreate
    ) -> BankAccountRead:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return create_bank_account_service(ctx.deps.session, current_user, data)

    @agent.tool
    def update_bank_account(
        ctx: RunContext[AgentDeps],
        bank_account_id: UUID,
        data: BankAccountUpdate,
    ) -> BankAccountRead:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return update_bank_account_service(
            ctx.deps.session, current_user, bank_account_id, data
        )

    @agent.tool
    def delete_bank_account(
        ctx: RunContext[AgentDeps], bank_account_id: UUID
    ) -> dict[str, str]:
        current_user = ctx.deps.current_user
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return delete_bank_account_service(
            ctx.deps.session, current_user, bank_account_id
        )

    return agent
