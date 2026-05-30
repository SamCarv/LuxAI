from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from fastapi import HTTPException
from sqlmodel import Session, select

from app.api.v1.schemas.goal import (
    GoalCreate,
    GoalRead,
    GoalTransactionCreate,
    GoalTransactionRead,
    GoalUpdate,
    GoalWithTransactions,
)
from app.models.goal import Goal
from app.models.goal_transaction import GoalTransaction
from app.models.transaction import Transaction
from app.models.user import User


async def list_goals_service(
    session: Session,
    current_user: User,
    limit: int = 50,
    offset: int = 0,
) -> List[Goal]:
    statement = (
        select(Goal)
        .where(Goal.user_id == current_user.id)
        .order_by(Goal.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    return list(session.exec(statement).all())


async def get_goal_service(
    session: Session,
    current_user: User,
    goal_id: UUID,
) -> Goal:
    goal = session.get(Goal, goal_id)
    if not goal or goal.user_id != current_user.id:
        raise HTTPException(404, "Goal not found!")
    return goal


async def create_goal_service(
    session: Session,
    current_user: User,
    data: GoalCreate,
) -> Goal:
    new_goal = Goal(
        title=data.title,
        description=data.description,
        target_amount=data.target_amount,
        current_amount=Decimal("0.00"),
        target_date=data.target_date,
        user_id=current_user.id,
    )

    try:
        session.add(new_goal)
        session.commit()
        session.refresh(new_goal)
        return new_goal
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error creating goal: {str(e)}",
        )


async def update_goal_service(
    session: Session,
    current_user: User,
    goal_id: UUID,
    data: GoalUpdate,
) -> Goal:
    goal = session.get(Goal, goal_id)
    if not goal or goal.user_id != current_user.id:
        raise HTTPException(404, "Goal not found!")

    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(goal, key, value)

    try:
        session.add(goal)
        session.commit()
        session.refresh(goal)
        return goal
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating goal: {str(e)}",
        )


async def delete_goal_service(
    session: Session,
    current_user: User,
    goal_id: UUID,
) -> dict:
    goal = session.get(Goal, goal_id)
    if not goal or goal.user_id != current_user.id:
        raise HTTPException(404, "Goal not found!")

    try:
        session.delete(goal)
        session.commit()
        return {"detail": "Goal deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting goal: {str(e)}",
        )


async def allocate_transaction_to_goal_service(
    session: Session,
    current_user: User,
    data: GoalTransactionCreate,
) -> GoalTransaction:
    goal = session.get(Goal, data.goal_id)
    if not goal or goal.user_id != current_user.id:
        raise HTTPException(404, "Goal not found!")

    transaction = session.get(Transaction, data.transaction_id)
    if not transaction:
        raise HTTPException(404, "Transaction not found!")

    from app.models.bank_account import BankAccount

    account = session.get(BankAccount, transaction.account_id)
    if not account or account.user_id != current_user.id:
        raise HTTPException(404, "Transaction not found!")

    if data.allocated_amount <= 0:
        raise HTTPException(400, "Allocated amount must be positive")

    from app.enums.transaction_type import TransactionType

    if transaction.type != TransactionType.INCOME:
        raise HTTPException(400, "Only income transactions can be allocated to goals")

    if data.allocated_amount > transaction.amount:
        raise HTTPException(
            400, "Allocated amount cannot be greater than transaction amount"
        )

    existing = session.exec(
        select(GoalTransaction).where(
            GoalTransaction.goal_id == data.goal_id,
            GoalTransaction.transaction_id == data.transaction_id,
        )
    ).first()
    if existing:
        raise HTTPException(400, "This transaction is already allocated to this goal")

    total_allocated_result = session.exec(
        select(GoalTransaction).where(
            GoalTransaction.transaction_id == data.transaction_id,
        )
    ).all()
    total_allocated = sum(gt.allocated_amount for gt in total_allocated_result)
    if total_allocated + data.allocated_amount > transaction.amount:
        raise HTTPException(
            400,
            "The sum of allocations exceeds the transaction amount",
        )

    goal_transaction = GoalTransaction(
        goal_id=data.goal_id,
        transaction_id=data.transaction_id,
        allocated_amount=data.allocated_amount,
    )

    goal.current_amount += data.allocated_amount

    try:
        session.add(goal)
        session.add(goal_transaction)
        session.commit()
        session.refresh(goal_transaction)
        return goal_transaction
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error allocating transaction to goal: {str(e)}",
        )


async def remove_transaction_from_goal_service(
    session: Session,
    current_user: User,
    goal_transaction_id: UUID,
) -> dict:
    goal_transaction = session.get(GoalTransaction, goal_transaction_id)
    if not goal_transaction:
        raise HTTPException(404, "Goal transaction not found!")

    goal = session.get(Goal, goal_transaction.goal_id)
    if not goal or goal.user_id != current_user.id:
        raise HTTPException(404, "Goal not found!")

    goal.current_amount -= goal_transaction.allocated_amount

    try:
        session.add(goal)
        session.delete(goal_transaction)
        session.commit()
        return {"detail": "Transaction removed from goal successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error removing transaction from goal: {str(e)}",
        )


async def get_goal_with_transactions_service(
    session: Session,
    current_user: User,
    goal_id: UUID,
) -> GoalWithTransactions:
    goal = await get_goal_service(session, current_user, goal_id)

    goal_transactions = session.exec(
        select(GoalTransaction).where(GoalTransaction.goal_id == goal_id)
    ).all()

    return GoalWithTransactions(
        id=goal.id,
        user_id=goal.user_id,
        title=goal.title,
        description=goal.description,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        target_date=goal.target_date,
        created_at=goal.created_at,
        updated_at=goal.updated_at,
        transactions=[
            GoalTransactionRead(
                id=gt.id,
                goal_id=gt.goal_id,
                transaction_id=gt.transaction_id,
                allocated_amount=gt.allocated_amount,
                created_at=gt.created_at,
            )
            for gt in goal_transactions
        ],
    )
