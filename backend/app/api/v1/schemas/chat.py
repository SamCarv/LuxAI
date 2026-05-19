from typing import Literal

from pydantic import BaseModel, Field


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
    history: list[ChatMessage] = Field(default_factory=list)
    attachments: list[ChatAttachment] = Field(default_factory=list)


class ChatResponse(BaseModel):
    response: str
