import json
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlmodel import Session

from app.api.v1.schemas.chat import (
    ChatMessage,
    ChatRequest,
    ChatResponse,
    ChatSessionList,
    ChatSessionRead,
    ChatSessionUpdate,
    ChatSessionWithMessages,
)
from app.core.security import CurrentUser
from app.db.database import get_session
from app.services.chat_service import run_chat
from app.services.chat_session_service import (
    delete_chat_session_service,
    get_chat_session_service,
    list_chat_sessions_service,
    update_chat_session_service,
)

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)

SessionDep = Annotated[Session, Depends(get_session)]


# ── Chat sessions (manage conversations) ──


@router.get("/sessions", response_model=ChatSessionList)
async def list_sessions(
    session: SessionDep,
    current_user: CurrentUser,
    limit: int = 20,
    offset: int = 0,
):
    return await list_chat_sessions_service(
        session, current_user, limit=limit, offset=offset
    )


@router.get("/sessions/{session_id}", response_model=ChatSessionWithMessages)
async def get_session(
    session_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await get_chat_session_service(session, current_user, session_id)


@router.patch("/sessions/{session_id}", response_model=ChatSessionRead)
async def update_session(
    session_id: UUID,
    data: ChatSessionUpdate,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await update_chat_session_service(session, current_user, session_id, data)


@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    return await delete_chat_session_service(session, current_user, session_id)


# ── Chat messages ──


@router.post("/", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    session: SessionDep,
    current_user: CurrentUser,
):
    result = await run_chat(
        payload.message,
        session,
        current_user,
        session_id=payload.session_id,
        history=[item.model_dump() for item in payload.history],
        attachments=payload.attachments,
    )
    return ChatResponse(response=result["response"], session_id=result["session_id"])


@router.post("/upload", response_model=ChatResponse)
async def chat_with_upload(
    session: SessionDep,
    current_user: CurrentUser,
    message: str = Form(...),
    files: list[UploadFile] = File(...),
    history: str | None = Form(None),
    session_id: UUID | None = Form(None),
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

    result = await run_chat(
        message,
        session,
        current_user,
        session_id=session_id,
        history=[item.model_dump() for item in parsed_history],
        files=files,
    )
    return ChatResponse(response=result["response"], session_id=result["session_id"])
