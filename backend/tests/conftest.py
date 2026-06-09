from __future__ import annotations

from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.db.database import get_session
from app.main import app


@pytest.fixture()
def anyio_backend():
    return "asyncio"


@pytest.fixture()
def session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as s:
        yield s


@pytest.fixture()
async def client(session: Session) -> AsyncGenerator[AsyncClient, None]:
    def _override():
        return session

    app.dependency_overrides[get_session] = _override
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.fixture()
def mock_storage_local(monkeypatch: pytest.MonkeyPatch, tmp_path):
    """Override storage to use a temporary local directory."""
    from app.services.storage import LocalStorage

    storage = LocalStorage(root=str(tmp_path))
    monkeypatch.setattr(
        "app.services.document_service.get_storage_backend",
        lambda: storage,
    )
    return tmp_path


@pytest.fixture()
def mock_embedding(monkeypatch: pytest.MonkeyPatch):
    """Mock embedding generation for document tests."""

    async def fake_get_embedding(*args, **kwargs):
        return [0.1] * 768

    monkeypatch.setattr(
        "app.services.document_service.get_embedding", fake_get_embedding
    )
