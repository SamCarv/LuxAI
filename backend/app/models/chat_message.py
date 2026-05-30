from datetime import datetime, timezone
from typing import TYPE_CHECKING, Literal, Optional
from uuid import UUID, uuid7

from sqlmodel import Column, DateTime, Field, Relationship, SQLModel, text

if TYPE_CHECKING:
    from .chat_session import ChatSession


class ChatMessage(SQLModel, table=True):  # type: ignore
    __tablename__: str = "chat_message"

    id: UUID = Field(
        default_factory=uuid7,
        primary_key=True,
        index=True,
        nullable=False,
    )

    session_id: UUID = Field(foreign_key="chat_session.id", nullable=False, index=True)

    role: str = Field(max_length=20)  # "user" or "assistant"
    content: str = Field()

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("now()"),
        ),
    )

    session: Optional["ChatSession"] = Relationship(back_populates="messages")
