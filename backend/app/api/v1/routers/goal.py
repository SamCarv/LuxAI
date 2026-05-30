from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.v1.schemas.goal import (
    GoalCreate,
    GoalRead,
    GoalTransactionCreate,
    GoalTransactionRead,
    GoalUpdate,
    GoalWithTransactions,
)
from app.core.security import CurrentUser
from app.db.database import get_session
from app.services.goal_service import (
    allocate_transaction_to_goal_service,
    create_goal_service,
    delete_goal_service,
    get_goal_service,
    get_goal_with_transactions_service,
    list_goals_service,
    remove_transaction_from_goal_service,
    update_goal_service,
)

router = APIRouter(
    prefix="/goal",
    tags=["goal"],
    responses={404: {"description": "Not found"}},
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=List[GoalRead])
async def list_goals(
    session: SessionDep,
    current_user: CurrentUser,
    limit: int = 50,
    offset: int = 0,
):
    return await list_goals_service(session, current_user, limit=limit, offset=offset)


@router.get("/{goal_id}", response_model=GoalRead)
async def get_goal(
    goal_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await get_goal_service(session, current_user, goal_id)


@router.get("/{goal_id}/details", response_model=GoalWithTransactions)
async def get_goal_details(
    goal_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await get_goal_with_transactions_service(session, current_user, goal_id)


@router.post("/", response_model=GoalRead)
async def create_goal(
    data: GoalCreate,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await create_goal_service(session, current_user, data)


@router.patch("/{goal_id}", response_model=GoalRead)
async def update_goal(
    goal_id: UUID,
    data: GoalUpdate,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await update_goal_service(session, current_user, goal_id, data)


@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await delete_goal_service(session, current_user, goal_id)


@router.post(
    "/allocate-transaction",
    response_model=GoalTransactionRead,
)
async def allocate_transaction(
    data: GoalTransactionCreate,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await allocate_transaction_to_goal_service(session, current_user, data)


@router.delete("/goal-transaction/{goal_transaction_id}")
async def remove_transaction_from_goal(
    goal_transaction_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await remove_transaction_from_goal_service(
        session, current_user, goal_transaction_id
    )
