import base64
import binascii
import io
import os
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import HTTPException, UploadFile
from pydantic_ai.messages import (
    ModelMessage,
    ModelRequest,
    ModelResponse,
    TextPart,
    UserPromptPart,
)
from sqlmodel import Session

from app.agents.chat import build_chat_agent
from app.agents.deps import AgentDeps
from app.api.v1.schemas.chat import ChatAttachment
from app.core.security import decrypt_string
from app.models.user import User
from app.services.chat_session_service import (
    get_or_create_session,
    get_session_history,
    save_message,
)
from app.services.document_service import create_document_service


def _resolve_api_key(current_user: User) -> str:
    if current_user.encrypted_google_api_key:
        return decrypt_string(current_user.encrypted_google_api_key)

    env_key = os.getenv("GOOGLE_API_KEY", "")
    if not env_key:
        raise HTTPException(status_code=400, detail="Google API Key not configured")
    return env_key


def _build_message_history(
    history: list[dict[str, str]] | None,
) -> list[ModelMessage] | None:
    if not history:
        return None

    messages: list[ModelMessage] = []
    now = datetime.now(timezone.utc)
    for item in history:
        role = item.get("role", "user")
        content = item.get("content", "")
        if role == "assistant":
            messages.append(
                ModelResponse(parts=[TextPart(content=content)], timestamp=now)
            )
        else:
            messages.append(
                ModelRequest(parts=[UserPromptPart(content=content)], timestamp=now)
            )

    return messages


class _InMemoryUpload:
    def __init__(self, filename: str, content_type: str, data: bytes) -> None:
        self.filename = filename
        self.content_type = content_type
        self._data = data
        self._read = False

    async def read(self) -> bytes:
        if self._read:
            return b""
        self._read = True
        return self._data

    async def close(self) -> None:
        return None


async def _process_attachments(
    session: Session,
    current_user: User,
    attachments: list[ChatAttachment],
) -> list[str]:
    titles: list[str] = []

    for attachment in attachments:
        try:
            data = base64.b64decode(attachment.base64_data, validate=True)
        except binascii.Error, ValueError:
            raise HTTPException(status_code=400, detail="Invalid base64 attachment")

        upload = _InMemoryUpload(
            attachment.filename,
            attachment.content_type,
            data,
        )

        document = await create_document_service(
            session,
            current_user,
            upload,
            title=attachment.title,
        )
        titles.append(document.title)

    return titles


async def _process_upload_files(
    session: Session,
    current_user: User,
    files: list[UploadFile],
) -> list[str]:
    titles: list[str] = []

    for upload in files:
        document = await create_document_service(
            session,
            current_user,
            upload,
            title=None,
        )
        titles.append(document.title)

    return titles


async def run_chat(
    message: str,
    session: Session,
    current_user: User,
    session_id: Optional[UUID] = None,
    history: list[dict[str, str]] | None = None,
    attachments: list[ChatAttachment] | None = None,
    files: list[UploadFile] | None = None,
) -> dict:
    api_key = _resolve_api_key(current_user)
    agent = build_chat_agent(api_key)
    deps = AgentDeps(session=session, current_user=current_user)

    chat_session = await get_or_create_session(
        session, current_user, session_id, first_message=message
    )

    if not history:
        history = await get_session_history(session, chat_session.id)

    message_history = _build_message_history(history)

    added_titles: list[str] = []
    if attachments:
        added_titles.extend(
            await _process_attachments(session, current_user, attachments)
        )
    if files:
        added_titles.extend(await _process_upload_files(session, current_user, files))

    if added_titles:
        message = (
            "Documentos adicionados nesta conversa: "
            f"{', '.join(added_titles)}.\n\n{message}"
        )

    await save_message(session, chat_session.id, role="user", content=message)

    async with agent:
        result = await agent.run(
            message,
            deps=deps,
            message_history=message_history,
        )

    await save_message(
        session, chat_session.id, role="assistant", content=result.output
    )

    return {"response": result.output, "session_id": chat_session.id}
