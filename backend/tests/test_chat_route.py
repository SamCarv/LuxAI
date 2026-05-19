from __future__ import annotations

import base64

import pytest
from httpx import AsyncClient


class _FakeAgent:
    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        return None

    async def run(self, message, deps=None, message_history=None):
        class _Result:
            output = "ok"

        return _Result()


@pytest.mark.asyncio()
async def test_chat_route_returns_response(
    client: AsyncClient, monkeypatch: pytest.MonkeyPatch
):
    monkeypatch.setenv("GOOGLE_API_KEY", "test-key")
    monkeypatch.setattr(
        "app.services.chat_service.build_chat_agent",
        lambda api_key: _FakeAgent(),
    )

    payload = {
        "message": "Olá",
        "history": [
            {"role": "user", "content": "Oi"},
            {"role": "assistant", "content": "Olá!"},
        ],
    }
    response = await client.post("/chat/", json=payload)

    assert response.status_code == 200
    assert response.json()["response"] == "ok"


@pytest.mark.asyncio()
async def test_chat_upload_saves_documents(
    client: AsyncClient,
    monkeypatch: pytest.MonkeyPatch,
    tmp_path,
):
    async def fake_get_embedding(*args, **kwargs):
        return [0.1] * 768

    monkeypatch.setenv("GOOGLE_API_KEY", "test-key")
    monkeypatch.setattr("app.services.document_service.STORAGE_ROOT", str(tmp_path))
    monkeypatch.setattr(
        "app.services.chat_service.build_chat_agent",
        lambda api_key: _FakeAgent(),
    )
    monkeypatch.setattr(
        "app.services.document_service.get_embedding",
        fake_get_embedding,
    )

    files = [
        ("files", ("conta-luz.txt", b"Conta de luz valor 123.45", "text/plain")),
    ]
    response = await client.post(
        "/chat/upload",
        data={"message": "Analise a conta"},
        files=files,
    )

    assert response.status_code == 200
    assert response.json()["response"] == "ok"

    list_response = await client.get("/document/")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1


@pytest.mark.asyncio()
async def test_chat_upload_multiple_files(
    client: AsyncClient,
    monkeypatch: pytest.MonkeyPatch,
    tmp_path,
):
    async def fake_get_embedding(*args, **kwargs):
        return [0.1] * 768

    monkeypatch.setenv("GOOGLE_API_KEY", "test-key")
    monkeypatch.setattr("app.services.document_service.STORAGE_ROOT", str(tmp_path))
    monkeypatch.setattr(
        "app.services.chat_service.build_chat_agent",
        lambda api_key: _FakeAgent(),
    )
    monkeypatch.setattr(
        "app.services.document_service.get_embedding",
        fake_get_embedding,
    )

    files = [
        ("files", ("conta-luz-1.txt", b"Conta 1", "text/plain")),
        ("files", ("conta-luz-2.txt", b"Conta 2", "text/plain")),
    ]
    response = await client.post(
        "/chat/upload",
        data={"message": "Analise as contas"},
        files=files,
    )

    assert response.status_code == 200
    assert response.json()["response"] == "ok"

    list_response = await client.get("/document/")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 2


@pytest.mark.asyncio()
async def test_chat_with_attachments_saves_documents(
    client: AsyncClient,
    monkeypatch: pytest.MonkeyPatch,
    tmp_path,
):
    async def fake_get_embedding(*args, **kwargs):
        return [0.1] * 768

    monkeypatch.setenv("GOOGLE_API_KEY", "test-key")
    monkeypatch.setattr("app.services.document_service.STORAGE_ROOT", str(tmp_path))
    monkeypatch.setattr(
        "app.services.chat_service.build_chat_agent",
        lambda api_key: _FakeAgent(),
    )
    monkeypatch.setattr(
        "app.services.document_service.get_embedding",
        fake_get_embedding,
    )

    encoded = base64.b64encode(b"Conta de luz 123").decode("utf-8")
    payload = {
        "message": "Analise a conta",
        "history": [],
        "attachments": [
            {
                "filename": "conta-luz.txt",
                "content_type": "text/plain",
                "base64_data": encoded,
                "title": "Conta Base64",
            }
        ],
    }

    response = await client.post("/chat/", json=payload)

    assert response.status_code == 200
    assert response.json()["response"] == "ok"

    list_response = await client.get("/document/")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1
