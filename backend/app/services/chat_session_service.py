from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from fastapi import HTTPException
from sqlmodel import Session, select

from app.api.v1.schemas.chat import (
    ChatMessageRead,
    ChatSessionRead,
    ChatSessionUpdate,
    ChatSessionWithMessages,
)
from app.models.chat_message import ChatMessage
from app.models.chat_session import ChatSession
from app.models.user import User


async def list_chat_sessions_service(
    session: Session,
    current_user: User,
    limit: int = 20,
    offset: int = 0,
) -> dict:
    count_statement = select(ChatSession).where(ChatSession.user_id == current_user.id)
    total = len(session.exec(count_statement).all())

    statement = (
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .offset(offset)
        .limit(limit)
    )

    sessions = session.exec(statement).all()

    return {
        "sessions": [ChatSessionRead.model_validate(s) for s in sessions],
        "total": total,
    }


async def get_chat_session_service(
    session: Session,
    current_user: User,
    session_id: UUID,
) -> ChatSessionWithMessages:
    chat_session = session.get(ChatSession, session_id)
    if not chat_session or chat_session.user_id != current_user.id:
        raise HTTPException(404, "Chat session not found!")

    messages = session.exec(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
    ).all()

    return ChatSessionWithMessages(
        id=chat_session.id,
        user_id=chat_session.user_id,
        title=chat_session.title,
        created_at=chat_session.created_at,
        updated_at=chat_session.updated_at,
        messages=[ChatMessageRead.model_validate(m) for m in messages],
    )


async def update_chat_session_service(
    session: Session,
    current_user: User,
    session_id: UUID,
    data: ChatSessionUpdate,
) -> ChatSessionRead:
    chat_session = session.get(ChatSession, session_id)
    if not chat_session or chat_session.user_id != current_user.id:
        raise HTTPException(404, "Chat session not found!")

    if data.title is not None:
        chat_session.title = data.title

    chat_session.updated_at = datetime.now(timezone.utc)

    try:
        session.add(chat_session)
        session.commit()
        session.refresh(chat_session)
        return ChatSessionRead.model_validate(chat_session)
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating chat session: {str(e)}",
        )


async def delete_chat_session_service(
    session: Session,
    current_user: User,
    session_id: UUID,
) -> dict:
    chat_session = session.get(ChatSession, session_id)
    if not chat_session or chat_session.user_id != current_user.id:
        raise HTTPException(404, "Chat session not found!")

    try:
        session.delete(chat_session)
        session.commit()
        return {"detail": "Chat session deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting chat session: {str(e)}",
        )


async def get_or_create_session(
    session: Session,
    current_user: User,
    session_id: Optional[UUID] = None,
    first_message: Optional[str] = None,
) -> ChatSession:
    if session_id:
        chat_session = session.get(ChatSession, session_id)
        if chat_session and chat_session.user_id == current_user.id:
            chat_session.updated_at = datetime.now(timezone.utc)
            session.add(chat_session)
            session.commit()
            session.refresh(chat_session)
            return chat_session

    title = "Nova conversa"
    if first_message:
        title = first_message[:80] + ("..." if len(first_message) > 80 else "")

    chat_session = ChatSession(
        user_id=current_user.id,
        title=title,
    )

    session.add(chat_session)
    session.commit()
    session.refresh(chat_session)
    return chat_session


async def save_message(
    session: Session,
    session_id: UUID,
    role: str,
    content: str,
) -> ChatMessage:
    message = ChatMessage(
        session_id=session_id,
        role=role,
        content=content,
    )

    session.add(message)
    session.commit()
    session.refresh(message)
    return message


async def get_session_history(
    session: Session,
    session_id: UUID,
) -> List[dict]:
    messages = session.exec(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
    ).all()

    return [{"role": m.role, "content": m.content} for m in messages]
