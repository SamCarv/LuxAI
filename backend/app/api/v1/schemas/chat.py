from datetime import datetime
from typing import Literal, Optional
from uuid import UUID

from pydantic import BaseModel, Field


# Chat request/response schemas (for sending messages)
class ChatAttachment(BaseModel):
    filename: str
    content_type: str
    base64_data: str
    title: str | None = None


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    session_id: Optional[UUID] = None
    history: list[ChatMessage] = Field(default_factory=list)
    attachments: list[ChatAttachment] = Field(default_factory=list)


class ChatResponse(BaseModel):
    response: str
    session_id: UUID


# Chat session schemas (for listing/managing sessions)
class ChatSessionRead(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    created_at: datetime
    updated_at: datetime


class ChatSessionUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=200)


class ChatMessageRead(BaseModel):
    id: UUID
    session_id: UUID
    role: str
    content: str
    created_at: datetime


class ChatSessionWithMessages(ChatSessionRead):
    messages: list["ChatMessageRead"] = []


class ChatSessionList(BaseModel):
    sessions: list["ChatSessionRead"]
    total: int
