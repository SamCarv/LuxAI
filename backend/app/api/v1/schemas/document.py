from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class DocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    title: str
    filename: str
    content_type: str
    storage_path: str
    metadata_info: Optional[Dict[str, Any]] = None
    created_at: datetime


class DocumentDetail(DocumentRead):
    model_config = ConfigDict(from_attributes=True)
    text: str


class DocumentSearchRequest(BaseModel):
    query: str
    limit: int = 5
    document_id: Optional[UUID] = None


class DocumentChunkResult(BaseModel):
    chunk_id: UUID
    document_id: UUID
    document_title: str
    document_filename: str
    chunk_index: int
    content: str


class DocumentSearchResponse(BaseModel):
    results: List[DocumentChunkResult]


class DocumentChatRequest(BaseModel):
    query: str
    limit: int = 5
    document_id: Optional[UUID] = None


class DocumentChatResponse(BaseModel):
    answer: str
    sources: List[DocumentChunkResult]
