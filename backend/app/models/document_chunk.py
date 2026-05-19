from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid7

from pgvector.sqlalchemy import Vector
from sqlmodel import Column, Field, Relationship, SQLModel, Text

if TYPE_CHECKING:
    from .document import Document


class DocumentChunk(SQLModel, table=True):
    __tablename__: str = "document_chunk"  # pyright: ignore[reportIncompatibleVariableOverride]

    id: UUID = Field(
        default_factory=uuid7,
        primary_key=True,
        index=True,
        nullable=False,
    )

    document_id: UUID = Field(foreign_key="document.id", index=True)
    user_id: UUID = Field(foreign_key="user.id", index=True)

    chunk_index: int
    content: str = Field(sa_column=Column(Text, nullable=False))

    embedding: Optional[List[float]] = Field(
        default=None,
        sa_column=Column(Vector(768), nullable=True),
    )

    document: Optional["Document"] = Relationship(back_populates="chunks")
