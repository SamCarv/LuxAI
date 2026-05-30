from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.core.security import CurrentUser
from app.db.database import get_session
from app.services.dashboard_service import get_dashboard_data

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
    responses={404: {"description": "Not found"}},
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/")
async def dashboard(
    session: SessionDep,
    current_user: CurrentUser,
    days: int = Query(
        default=30, ge=7, le=365, description="Período em dias para análise"
    ),
):
    return await get_dashboard_data(session, current_user, days=days)
