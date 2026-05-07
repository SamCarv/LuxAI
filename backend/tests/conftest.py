import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from contextlib import asynccontextmanager

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from app.core.security import get_current_user
from app.db.database import get_session
from app.main import app
from app.models.user import User


@pytest.fixture()
def test_engine():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture()
def test_user(test_engine):
    with Session(test_engine) as session:
        user = User(
            full_name="Test User",
            email="test-user@example.com",
            hashed_password="hashed",
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        return user


@pytest_asyncio.fixture()
async def client(test_engine, test_user):
    def override_get_session():
        with Session(test_engine) as session:
            yield session

    def override_get_current_user():
        return test_user

    app.dependency_overrides[get_session] = override_get_session
    app.dependency_overrides[get_current_user] = override_get_current_user

    @asynccontextmanager
    async def _lifespan(_app):
        yield

    original_lifespan = app.router.lifespan_context
    app.router.lifespan_context = _lifespan

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client

    app.router.lifespan_context = original_lifespan
    app.dependency_overrides.clear()
