import json
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlmodel import Session

from app.api.v1.schemas.chat import ChatMessage, ChatRequest, ChatResponse
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
        attachments=payload.attachments,
    )
    return ChatResponse(response=response_text)


@router.post("/upload", response_model=ChatResponse)
async def chat_with_upload(
    session: SessionDep,
    current_user: CurrentUser,
    message: str = Form(...),
    files: list[UploadFile] = File(...),
    history: str | None = Form(None),
):
    parsed_history: list[ChatMessage] = []
    if history:
        try:
            raw_history = json.loads(history)
        except json.JSONDecodeError as exc:
            raise HTTPException(status_code=400, detail="Invalid history JSON") from exc

        if not isinstance(raw_history, list):
            raise HTTPException(status_code=400, detail="History must be a list")

        parsed_history = [ChatMessage.model_validate(item) for item in raw_history]

    response_text = await run_chat(
        message,
        session,
        current_user,
        history=[item.model_dump() for item in parsed_history],
        files=files,
    )
    return ChatResponse(response=response_text)
