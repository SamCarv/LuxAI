from __future__ import annotations

from decimal import Decimal

import pytest
from httpx import AsyncClient


@pytest.fixture()
def mock_embedding(monkeypatch: pytest.MonkeyPatch):
    async def fake_get_embedding(*args, **kwargs):
        return [0.1] * 768

    monkeypatch.setattr("app.agents.transaction.get_embedding", fake_get_embedding)


@pytest.mark.asyncio()
async def test_category_routes_crud(client: AsyncClient):
    create_payload = {"name": "Food", "icon": "🍔", "color": "#ffcc00"}
    create_response = await client.post("/category/", json=create_payload)
    assert create_response.status_code == 200
    created = create_response.json()
    assert created["name"] == "Food"

    list_response = await client.get("/category/")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    category_id = created["id"]
    update_response = await client.patch(
        f"/category/{category_id}", json={"color": "#ffffff"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["color"] == "#ffffff"

    delete_response = await client.delete(f"/category/{category_id}")
    assert delete_response.status_code == 200


@pytest.mark.asyncio()
async def test_bank_account_routes_crud(client: AsyncClient):
    payload = {
        "name": "Main Account",
        "balance": "0.00",
        "currency": "USD",
        "account_type": "CHECKING",
    }
    create_response = await client.post("/bank_account/", json=payload)
    assert create_response.status_code == 200
    created = create_response.json()
    assert created["name"] == "Main Account"

    list_response = await client.get("/bank_account/")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    account_id = created["id"]
    update_response = await client.patch(
        f"/bank_account/{account_id}", json={"balance": "100.50"}
    )
    assert update_response.status_code == 200
    assert Decimal(update_response.json()["balance"]) == Decimal("100.50")

    delete_response = await client.delete(f"/bank_account/{account_id}")
    assert delete_response.status_code == 200


@pytest.mark.asyncio()
async def test_transaction_routes_crud(client: AsyncClient, mock_embedding):
    account_payload = {
        "name": "Wallet",
        "balance": "0.00",
        "currency": "USD",
        "account_type": "CHECKING",
    }
    account_response = await client.post("/bank_account/", json=account_payload)
    account_id = account_response.json()["id"]

    category_response = await client.post("/category/", json={"name": "Groceries"})
    category_id = category_response.json()["id"]

    transaction_payload = {
        "description": "Market",
        "amount": "25.90",
        "type": "expense",
        "category_id": category_id,
        "account_id": account_id,
        "metadata_info": {"source": "manual"},
    }
    create_response = await client.post("/transaction/", json=transaction_payload)
    assert create_response.status_code == 200
    created = create_response.json()
    assert created["description"] == "Market"

    transaction_id = created["id"]
    update_response = await client.patch(
        f"/transaction/{transaction_id}",
        json={"description": "Market updated"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["description"] == "Market updated"

    delete_response = await client.delete(f"/transaction/{transaction_id}")
    assert delete_response.status_code == 200


@pytest.mark.asyncio()
async def test_transaction_history_and_filters(client: AsyncClient, mock_embedding):
    account_1 = await client.post(
        "/bank_account/",
        json={
            "name": "Primary",
            "balance": "0.00",
            "currency": "USD",
            "account_type": "CHECKING",
        },
    )
    account_2 = await client.post(
        "/bank_account/",
        json={
            "name": "Secondary",
            "balance": "0.00",
            "currency": "USD",
            "account_type": "CHECKING",
        },
    )
    account_1_id = account_1.json()["id"]
    account_2_id = account_2.json()["id"]

    category_1 = await client.post("/category/", json={"name": "Food"})
    category_2 = await client.post("/category/", json={"name": "Rent"})
    category_1_id = category_1.json()["id"]
    category_2_id = category_2.json()["id"]

    await client.post(
        "/transaction/",
        json={
            "description": "Groceries",
            "amount": "10.00",
            "type": "expense",
            "category_id": category_1_id,
            "account_id": account_1_id,
        },
    )
    await client.post(
        "/transaction/",
        json={
            "description": "Salary",
            "amount": "20.00",
            "type": "income",
            "category_id": category_2_id,
            "account_id": account_1_id,
        },
    )
    await client.post(
        "/transaction/",
        json={
            "description": "Snack",
            "amount": "5.00",
            "type": "expense",
            "category_id": category_1_id,
            "account_id": account_2_id,
        },
    )

    all_response = await client.get("/transaction/")
    assert all_response.status_code == 200
    assert len(all_response.json()) == 3

    account_filtered = await client.get(
        "/transaction/", params={"account_id": account_1_id}
    )
    assert account_filtered.status_code == 200
    assert len(account_filtered.json()) == 2

    category_filtered = await client.get(
        "/transaction/", params={"category_id": category_1_id}
    )
    assert category_filtered.status_code == 200
    assert len(category_filtered.json()) == 2

    combined_filtered = await client.get(
        "/transaction/",
        params={"account_id": account_1_id, "category_id": category_1_id},
    )
    assert combined_filtered.status_code == 200
    assert len(combined_filtered.json()) == 1


@pytest.mark.asyncio()
async def test_category_includes_transactions(client: AsyncClient, mock_embedding):
    account_response = await client.post(
        "/bank_account/",
        json={
            "name": "Category Wallet",
            "balance": "0.00",
            "currency": "USD",
            "account_type": "CHECKING",
        },
    )
    account_id = account_response.json()["id"]

    category_response = await client.post("/category/", json={"name": "Bills"})
    category_id = category_response.json()["id"]

    transaction_response = await client.post(
        "/transaction/",
        json={
            "description": "Electric bill",
            "amount": "90.00",
            "type": "expense",
            "category_id": category_id,
            "account_id": account_id,
        },
    )
    assert transaction_response.status_code == 200
    transaction_id = transaction_response.json()["id"]

    category_detail = await client.get(f"/category/{category_id}")
    assert category_detail.status_code == 200
    transactions = category_detail.json()["transactions"]
    assert len(transactions) == 1
    assert transactions[0]["id"] == transaction_id


@pytest.mark.asyncio()
async def test_transaction_recurrence_validation(client: AsyncClient, mock_embedding):
    account_response = await client.post(
        "/bank_account/",
        json={
            "name": "Recurring",
            "balance": "0.00",
            "currency": "USD",
            "account_type": "CHECKING",
        },
    )
    account_id = account_response.json()["id"]

    invalid_weekly = await client.post(
        "/transaction/",
        json={
            "description": "Weekly charge",
            "amount": "10.00",
            "type": "expense",
            "account_id": account_id,
            "recurrence_frequency": "weekly",
            "recurrence_day": 9,
        },
    )
    assert invalid_weekly.status_code == 400

    invalid_daily = await client.post(
        "/transaction/",
        json={
            "description": "Daily charge",
            "amount": "5.00",
            "type": "expense",
            "account_id": account_id,
            "recurrence_frequency": "daily",
            "recurrence_day": 1,
        },
    )
    assert invalid_daily.status_code == 400

    valid_monthly = await client.post(
        "/transaction/",
        json={
            "description": "Monthly charge",
            "amount": "15.00",
            "type": "expense",
            "account_id": account_id,
            "recurrence_frequency": "monthly",
            "recurrence_day": 10,
        },
    )
    assert valid_monthly.status_code == 200
    created = valid_monthly.json()
    assert created["recurrence_frequency"] == "monthly"
    assert created["recurrence_day"] == 10
    assert created["category_id"] is None


@pytest.mark.asyncio()
async def test_transaction_adjusts_account_balance(client: AsyncClient, mock_embedding):
    account_1 = await client.post(
        "/bank_account/",
        json={
            "name": "Balance A",
            "balance": "0.00",
            "currency": "USD",
            "account_type": "CHECKING",
        },
    )
    account_2 = await client.post(
        "/bank_account/",
        json={
            "name": "Balance B",
            "balance": "10.00",
            "currency": "USD",
            "account_type": "CHECKING",
        },
    )
    account_1_id = account_1.json()["id"]
    account_2_id = account_2.json()["id"]

    created = await client.post(
        "/transaction/",
        json={
            "description": "Initial expense",
            "amount": "50.00",
            "type": "expense",
            "account_id": account_1_id,
        },
    )
    assert created.status_code == 200
    transaction_id = created.json()["id"]

    account_1_after = await client.get(f"/bank_account/{account_1_id}")
    assert Decimal(account_1_after.json()["balance"]) == Decimal("-50.00")

    await client.patch(
        f"/transaction/{transaction_id}",
        json={"amount": "30.00"},
    )
    account_1_after = await client.get(f"/bank_account/{account_1_id}")
    assert Decimal(account_1_after.json()["balance"]) == Decimal("-30.00")

    await client.patch(
        f"/transaction/{transaction_id}",
        json={"type": "income"},
    )
    account_1_after = await client.get(f"/bank_account/{account_1_id}")
    assert Decimal(account_1_after.json()["balance"]) == Decimal("30.00")

    await client.patch(
        f"/transaction/{transaction_id}",
        json={"account_id": account_2_id},
    )
    account_1_after = await client.get(f"/bank_account/{account_1_id}")
    account_2_after = await client.get(f"/bank_account/{account_2_id}")
    assert Decimal(account_1_after.json()["balance"]) == Decimal("0.00")
    assert Decimal(account_2_after.json()["balance"]) == Decimal("40.00")

    await client.delete(f"/transaction/{transaction_id}")
    account_2_after = await client.get(f"/bank_account/{account_2_id}")
    assert Decimal(account_2_after.json()["balance"]) == Decimal("10.00")
