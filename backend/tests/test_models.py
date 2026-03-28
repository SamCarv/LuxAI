from __future__ import annotations

from datetime import timezone
from decimal import Decimal
from typing import Generator

import pytest
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, SQLModel, create_engine, select

from app.ai.providers.ollama import OLLAMA_API_URL, get_embedding
from app.enums import AccountType, Currency
from app.enums.transaction_type import TransactionType
from app.models.bank_account import BankAccount
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.services.ai_service import process_transaction_embedding


@pytest.fixture()
def session() -> Generator[Session, None, None]:
    """Creates an isolated in-memory database session for each test."""
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)

    with Session(engine) as db_session:
        yield db_session


def test_user_defaults(session: Session) -> None:
    """Validates User default values after persistence."""
    user = User(
        full_name="Jane Doe",
        email="jane@example.com",
        hashed_password="hashed-secret",
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    assert user.id is not None
    assert user.is_active is True
    assert user.created_at is not None


def test_user_email_must_be_unique(session: Session) -> None:
    """Ensures database unique constraint on user email is enforced."""
    first_user = User(
        full_name="Jane Doe",
        email="unique@example.com",
        hashed_password="hashed-1",
    )
    second_user = User(
        full_name="John Doe",
        email="unique@example.com",
        hashed_password="hashed-2",
    )

    session.add(first_user)
    session.commit()

    session.add(second_user)
    with pytest.raises(IntegrityError):
        session.commit()

    session.rollback()


def test_bank_account_defaults(session: Session) -> None:
    """Validates BankAccount defaults when optional fields are not provided."""
    user = User(
        full_name="Account Owner",
        email="owner@example.com",
        hashed_password="hashed-owner",
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.id is not None

    account = BankAccount(name="Main account", user_id=user.id)
    session.add(account)
    session.commit()
    session.refresh(account)

    assert account.id is not None
    assert account.balance == Decimal("0.00")
    assert account.currency == Currency.USD
    assert account.account_type == AccountType.CHECKING


def test_user_and_accounts_relationship(session: Session) -> None:
    """Verifies one-to-many relationship loading between User and BankAccount."""
    user = User(
        full_name="Rel User",
        email="rel@example.com",
        hashed_password="hashed-rel",
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.id is not None

    account_1 = BankAccount(
        name="Savings",
        balance=Decimal("100.50"),
        currency=Currency.BRL,
        account_type=AccountType.SAVINGS,
        user_id=user.id,
    )
    account_2 = BankAccount(
        name="Credit",
        balance=Decimal("500.00"),
        currency=Currency.USD,
        account_type=AccountType.CREDIT,
        user_id=user.id,
    )
    session.add(account_1)
    session.add(account_2)
    session.commit()

    db_user = session.exec(select(User).where(User.id == user.id)).one()
    assert len(db_user.accounts) == 2
    assert {a.name for a in db_user.accounts} == {"Savings", "Credit"}


def test_category_defaults_and_relationship_with_user(session: Session) -> None:
    """Ensures Category is persisted and related to the owner user."""
    user = User(
        full_name="Category Owner",
        email="category@example.com",
        hashed_password="hashed-category",
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.id is not None

    category = Category(name="Groceries", user_id=user.id)
    session.add(category)
    session.commit()
    session.refresh(category)

    assert category.id is not None
    assert category.icon is None
    assert category.color is None

    db_user = session.exec(select(User).where(User.id == user.id)).one()
    assert len(db_user.categories) == 1
    assert db_user.categories[0].name == "Groceries"


def test_transaction_defaults_and_relationships(session: Session) -> None:
    """Validates Transaction defaults, metadata and relationship mapping."""
    user = User(
        full_name="Tx Owner",
        email="tx-owner@example.com",
        hashed_password="hashed-tx",
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.id is not None

    account = BankAccount(name="Wallet", user_id=user.id)
    category = Category(name="Food", user_id=user.id)
    session.add(account)
    session.add(category)
    session.commit()
    session.refresh(account)
    session.refresh(category)
    assert account.id is not None
    assert category.id is not None

    transaction = Transaction(
        description="Lunch",
        amount=Decimal("29.90"),
        account_id=account.id,
        category_id=category.id,
    )
    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    assert transaction.id is not None
    assert transaction.type == TransactionType.EXPENSE
    # SQLite drops timezone info when reading datetime columns back.
    assert transaction.date.tzinfo in (None, timezone.utc)
    assert transaction.metadata_info == {}
    assert transaction.description_vector is None

    db_account = session.exec(
        select(BankAccount).where(BankAccount.id == account.id)
    ).one()
    db_category = session.exec(select(Category).where(Category.id == category.id)).one()
    assert len(db_account.transactions) == 1
    assert db_account.transactions[0].description == "Lunch"
    assert len(db_category.transactions) == 1
    assert db_category.transactions[0].amount == Decimal("29.90")


def test_transaction_metadata_and_embedding_vector_persistence(
    session: Session,
) -> None:
    """Checks custom metadata and embedding vectors are persisted."""
    user = User(
        full_name="Embedding Owner",
        email="embedding-owner@example.com",
        hashed_password="hashed-embedding",
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.id is not None

    account = BankAccount(name="Investments", user_id=user.id)
    category = Category(name="Salary", user_id=user.id)
    session.add(account)
    session.add(category)
    session.commit()
    session.refresh(account)
    session.refresh(category)
    assert account.id is not None
    assert category.id is not None

    transaction = Transaction(
        description="Salary payment",
        amount=Decimal("1000.00"),
        type=TransactionType.INCOME,
        account_id=account.id,
        category_id=category.id,
        description_vector=[0.1, 0.2, 0.3],
        metadata_info={"source": "ocr", "confidence": 0.98},
    )
    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    assert transaction.type == TransactionType.INCOME
    assert transaction.description_vector == [0.1, 0.2, 0.3]
    assert transaction.metadata_info == {"source": "ocr", "confidence": 0.98}


@pytest.mark.asyncio()
async def test_get_embedding_calls_ollama(monkeypatch: pytest.MonkeyPatch) -> None:
    """Ensures Ollama provider uses expected endpoint and payload."""

    class DummyResponse:
        def json(self) -> dict[str, list[float]]:
            return {"embedding": [0.4, 0.5, 0.6]}

    class DummyClient:
        captured_url: str | None = None
        captured_json: dict[str, str] | None = None

        async def __aenter__(self) -> "DummyClient":
            return self

        async def __aexit__(self, exc_type, exc, tb) -> None:
            return None

        async def post(self, url: str, json: dict[str, str]) -> DummyResponse:
            self.captured_url = url
            self.captured_json = json
            return DummyResponse()

    dummy_client = DummyClient()

    def client_factory() -> DummyClient:
        return dummy_client

    monkeypatch.setattr("app.ai.providers.ollama.httpx.AsyncClient", client_factory)

    embedding = await get_embedding("grocery transaction")

    assert embedding == [0.4, 0.5, 0.6]
    assert dummy_client.captured_url == OLLAMA_API_URL
    assert dummy_client.captured_json == {
        "model": "qwen3-embedding:4b",
        "prompt": "grocery transaction",
    }


@pytest.mark.asyncio()
async def test_process_transaction_embedding_delegates_provider(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Verifies AI service delegates embedding generation to provider."""

    async def fake_get_embedding(text: str) -> list[float]:
        assert text == "Taxi fare"
        return [0.9, 0.1]

    monkeypatch.setattr("app.services.ai_service.get_embedding", fake_get_embedding)

    result = await process_transaction_embedding("Taxi fare")

    assert result == [0.9, 0.1]


def test_sqlmodel_metadata_creates_all_tables() -> None:
    """Checks that SQLModel metadata creates tables and they are writable."""
    engine = create_engine("sqlite:///:memory:")

    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        user = User(
            full_name="Schema User",
            email="schema@example.com",
            hashed_password="schema-pass",
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        assert user.id is not None

        account = BankAccount(name="Schema account", user_id=user.id)
        category = Category(name="Schema category", user_id=user.id)
        session.add(account)
        session.add(category)
        session.commit()
        session.refresh(account)
        session.refresh(category)

        transaction = Transaction(
            description="Schema transaction",
            amount=Decimal("10.00"),
            account_id=account.id,
            category_id=category.id,
        )
        session.add(transaction)
        session.commit()

        users = session.exec(select(User)).all()
        accounts = session.exec(select(BankAccount)).all()
        categories = session.exec(select(Category)).all()
        transactions = session.exec(select(Transaction)).all()

        assert len(users) == 1
        assert len(accounts) == 1
        assert len(categories) == 1
        assert len(transactions) == 1
