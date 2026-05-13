from __future__ import annotations

from decimal import Decimal

import pytest
from httpx import AsyncClient


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
async def test_transaction_routes_crud(
    client: AsyncClient, monkeypatch: pytest.MonkeyPatch
):
    async def fake_get_embedding(*args, **kwargs):
        return [0.1] * 768

    monkeypatch.setattr("app.agents.transaction.get_embedding", fake_get_embedding)

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
