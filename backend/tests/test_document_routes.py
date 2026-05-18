from __future__ import annotations

import io
from uuid import UUID, uuid4

import pytest
from httpx import AsyncClient
from PIL import Image, ImageDraw, ImageFont
from sqlmodel import select

from app.models.document import Document
from app.models.document_chunk import DocumentChunk


@pytest.fixture()
def mock_document_embedding(monkeypatch: pytest.MonkeyPatch):
    async def fake_get_embedding(*args, **kwargs):
        return [0.1] * 768

    monkeypatch.setattr(
        "app.services.document_service.get_embedding", fake_get_embedding
    )


def _text_upload(content: bytes, filename: str = "doc.txt"):
    return {"file": (filename, content, "text/plain")}


def _tesseract_available() -> bool:
    try:
        import pytesseract

        _ = pytesseract.get_tesseract_version()
        return True
    except Exception:
        return False


def _image_upload_from_text(text: str, filename: str = "doc.png"):
    image = Image.new("RGB", (800, 200), color="white")
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 32)
    except Exception:
        font = ImageFont.load_default()
    draw.text((20, 60), text, fill="black", font=font)

    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return {"file": (filename, buffer.read(), "image/png")}


@pytest.mark.asyncio()
async def test_document_upload_list_detail(
    client: AsyncClient,
    monkeypatch: pytest.MonkeyPatch,
    tmp_path,
    mock_document_embedding,
):
    monkeypatch.setattr("app.services.document_service.STORAGE_ROOT", str(tmp_path))

    content = b"Conta de luz agosto valor total 123.45"
    response = await client.post(
        "/document/",
        files=_text_upload(content, "conta-luz.txt"),
        data={"title": "Conta de Luz Agosto"},
    )

    assert response.status_code == 200
    created = response.json()
    assert created["title"] == "Conta de Luz Agosto"

    list_response = await client.get("/document/")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    detail_response = await client.get(f"/document/{created['id']}")
    assert detail_response.status_code == 200
    assert "valor total 123.45" in detail_response.json()["text"]


@pytest.mark.asyncio()
async def test_document_search_route_returns_results(
    client: AsyncClient,
    monkeypatch: pytest.MonkeyPatch,
):
    async def fake_search_document_chunks(*args, **kwargs):
        class _Doc:
            id = uuid4()
            title = "Conta de Luz"
            filename = "conta-luz.txt"

        class _Chunk:
            id = uuid4()
            chunk_index = 0
            content = "Valor total 123.45"

        return [(_Chunk(), _Doc())]

    monkeypatch.setattr(
        "app.api.v1.routers.document.search_document_chunks",
        fake_search_document_chunks,
    )

    response = await client.post(
        "/document/search",
        json={"query": "valor total", "limit": 3},
    )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload["results"]) == 1
    assert payload["results"][0]["document_title"] == "Conta de Luz"


@pytest.mark.asyncio()
async def test_document_upload_image_ocr(
    client: AsyncClient,
    monkeypatch: pytest.MonkeyPatch,
    tmp_path,
    mock_document_embedding,
):
    if not _tesseract_available():
        pytest.skip("tesseract not available")

    monkeypatch.setattr("app.services.document_service.STORAGE_ROOT", str(tmp_path))

    response = await client.post(
        "/document/",
        files=_image_upload_from_text("LUXAI 123"),
        data={"title": "OCR Test"},
    )

    assert response.status_code == 200
    created = response.json()

    detail_response = await client.get(f"/document/{created['id']}")
    assert detail_response.status_code == 200
    extracted = detail_response.json()["text"].lower().replace(" ", "")
    assert "luxai" in extracted


@pytest.mark.asyncio()
async def test_document_rag_search_and_chat_returns_sources(
    client: AsyncClient,
    monkeypatch: pytest.MonkeyPatch,
    tmp_path,
    mock_document_embedding,
):
    class _FakeAgent:
        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return None

        async def run(self, message, deps=None, message_history=None):
            class _Result:
                output = "ok"

            return _Result()

    async def fake_search_document_chunks(
        session,
        current_user,
        query: str,
        limit: int = 5,
        document_id: UUID | None = None,
    ):
        statement = (
            select(DocumentChunk, Document)
            .join(Document, DocumentChunk.document_id == Document.id)
            .where(DocumentChunk.user_id == current_user.id)
        )
        if document_id:
            statement = statement.where(DocumentChunk.document_id == document_id)
        rows = list(session.exec(statement).all())
        filtered = [row for row in rows if query.lower() in row[0].content.lower()]
        return filtered[:limit]

    monkeypatch.setenv("GOOGLE_API_KEY", "test-key")
    monkeypatch.setattr("app.services.document_service.STORAGE_ROOT", str(tmp_path))
    monkeypatch.setattr(
        "app.services.document_service.search_document_chunks",
        fake_search_document_chunks,
    )
    monkeypatch.setattr(
        "app.api.v1.routers.document.search_document_chunks",
        fake_search_document_chunks,
    )
    monkeypatch.setattr(
        "app.services.document_service.build_document_chat_agent",
        lambda api_key: _FakeAgent(),
    )

    upload_response = await client.post(
        "/document/",
        files=_text_upload(b"Conta de luz valor total 123.45", "conta-luz.txt"),
        data={"title": "Conta de Luz"},
    )
    assert upload_response.status_code == 200
    document_id = upload_response.json()["id"]

    search_response = await client.post(
        "/document/search",
        json={"query": "valor total", "limit": 3, "document_id": document_id},
    )
    assert search_response.status_code == 200
    search_payload = search_response.json()
    assert len(search_payload["results"]) == 1
    assert "valor total" in search_payload["results"][0]["content"].lower()

    chat_response = await client.post(
        "/document/chat",
        json={"query": "valor total", "limit": 3, "document_id": document_id},
    )
    assert chat_response.status_code == 200
    chat_payload = chat_response.json()
    assert chat_payload["answer"] == "ok"
    assert len(chat_payload["sources"]) == 1
    assert "valor total" in chat_payload["sources"][0]["content"].lower()
