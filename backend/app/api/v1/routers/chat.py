from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.v1.schemas.chat import ChatRequest, ChatResponse
from app.core.security import CurrentUser
from app.db.database import get_session
from app.services.chat_service import run_chat

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    session: SessionDep,
    current_user: CurrentUser,
):
    response_text = await run_chat(
        payload.message,
        session,
        current_user,
        history=[item.model_dump() for item in payload.history],
    )
    return ChatResponse(response=response_text)
