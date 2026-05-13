from __future__ import annotations

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
