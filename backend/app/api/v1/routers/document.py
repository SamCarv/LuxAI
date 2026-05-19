from typing import Annotated, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlmodel import Session

from app.api.v1.schemas.document import (
    DocumentChatRequest,
    DocumentChatResponse,
    DocumentChunkResult,
    DocumentDetail,
    DocumentRead,
    DocumentSearchRequest,
    DocumentSearchResponse,
)
from app.core.security import CurrentUser
from app.db.database import get_session
from app.services.document_service import (
    create_document_service,
    get_document_service,
    list_documents_service,
    run_document_chat,
    search_document_chunks,
)

router = APIRouter(
    prefix="/document",
    tags=["document"],
    responses={404: {"description": "Not found"}},
)
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/", response_model=DocumentRead)
async def upload_document(
    session: SessionDep,
    current_user: CurrentUser,
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
):
    document = await create_document_service(session, current_user, file, title=title)
    return DocumentRead.model_validate(document)


@router.get("/", response_model=List[DocumentRead])
def list_documents(
    session: SessionDep,
    current_user: CurrentUser,
    limit: int = 50,
    offset: int = 0,
):
    documents = list_documents_service(
        session, current_user, limit=limit, offset=offset
    )
    return [DocumentRead.model_validate(doc) for doc in documents]


@router.get("/{document_id}", response_model=DocumentDetail)
def get_document(
    document_id: UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    document = get_document_service(session, current_user, document_id)
    return DocumentDetail.model_validate(document)


@router.post("/search", response_model=DocumentSearchResponse)
async def search_documents(
    payload: DocumentSearchRequest,
    session: SessionDep,
    current_user: CurrentUser,
):
    matches = await search_document_chunks(
        session,
        current_user,
        payload.query,
        limit=payload.limit,
        document_id=payload.document_id,
    )

    results = [
        DocumentChunkResult(
            chunk_id=chunk.id,
            document_id=doc.id,
            document_title=doc.title,
            document_filename=doc.filename,
            chunk_index=chunk.chunk_index,
            content=chunk.content,
        )
        for chunk, doc in matches
    ]

    return DocumentSearchResponse(results=results)


@router.post("/chat", response_model=DocumentChatResponse)
async def chat_documents(
    payload: DocumentChatRequest,
    session: SessionDep,
    current_user: CurrentUser,
):
    answer, matches = await run_document_chat(
        session,
        current_user,
        payload.query,
        limit=payload.limit,
        document_id=payload.document_id,
    )

    sources = [
        DocumentChunkResult(
            chunk_id=chunk.id,
            document_id=doc.id,
            document_title=doc.title,
            document_filename=doc.filename,
            chunk_index=chunk.chunk_index,
            content=chunk.content,
        )
        for chunk, doc in matches
    ]

    return DocumentChatResponse(answer=answer, sources=sources)
