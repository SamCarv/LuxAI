from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.v1.schemas.dashboard import DashboardRequest, DashboardResponse
from app.core.security import CurrentUser
from app.db.database import get_session
from app.services.dashboard_service import run_dashboard_analysis

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
    responses={404: {"description": "Not found"}},
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/analyze", response_model=DashboardResponse)
async def analyze_dashboard(
    session: SessionDep,
    current_user: CurrentUser,
    payload: DashboardRequest,
):
    """Gera uma análise financeira completa do mês usando IA.

    A IA analisa:
    - Fluxo de dinheiro e saúde financeira do mês
    - Gastos por categoria
    - Maiores consumos e ritmo de gastos
    - Progresso das metas financeiras
    - Recomendações personalizadas
    """
    analysis, month, year = await run_dashboard_analysis(
        session=session,
        current_user=current_user,
        month=payload.month,
        year=payload.year,
    )

    return DashboardResponse(
        analysis=analysis,
        month=month,
        year=year,
    )
