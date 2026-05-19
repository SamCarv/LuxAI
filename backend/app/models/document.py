from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any, Dict, List, Optional
from uuid import UUID, uuid7

from sqlmodel import JSON, Column, Field, Relationship, SQLModel, Text

if TYPE_CHECKING:
    from .document_chunk import DocumentChunk
    from .user import User


class Document(SQLModel, table=True):
    __tablename__: str = "document"  # pyright: ignore[reportIncompatibleVariableOverride]

    id: UUID = Field(
        default_factory=uuid7,
        primary_key=True,
        index=True,
        nullable=False,
    )

    user_id: UUID = Field(foreign_key="user.id", index=True)

    title: str
    filename: str
    content_type: str
    storage_path: str

    text: str = Field(sa_column=Column(Text, nullable=False))

    metadata_info: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        sa_type=JSON,
    )

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    user: Optional["User"] = Relationship(back_populates="documents")
    chunks: List["DocumentChunk"] = Relationship(back_populates="document")
