from __future__ import annotations

from datetime import date
from decimal import Decimal

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio()
async def test_goal_routes_crud(client: AsyncClient):
    """Testa o CRUD completo de metas financeiras."""
    # CREATE
    create_payload = {
        "name": "Viagem para Europa",
        "target_amount": "10000.00",
        "initial_amount": "2500.00",
        "deadline": "2026-12-31",
    }
    create_response = await client.post("/goal/", json=create_payload)
    assert create_response.status_code == 200
    created = create_response.json()
    assert created["name"] == "Viagem para Europa"
    assert Decimal(created["target_amount"]) == Decimal("10000.00")
    assert Decimal(created["current_amount"]) == Decimal("2500.00")
    assert created["deadline"] == "2026-12-31"
    assert "id" in created
    assert "user_id" in created

    # LIST
    list_response = await client.get("/goal/")
    assert list_response.status_code == 200
    goals = list_response.json()
    assert len(goals) == 1
    assert goals[0]["name"] == "Viagem para Europa"

    # GET by ID
    goal_id = created["id"]
    get_response = await client.get(f"/goal/{goal_id}")
    assert get_response.status_code == 200
    assert get_response.json()["name"] == "Viagem para Europa"

    # UPDATE
    update_payload = {
        "name": "Viagem para Europa 2027",
        "current_amount": "5000.00",
    }
    update_response = await client.patch(f"/goal/{goal_id}", json=update_payload)
    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated["name"] == "Viagem para Europa 2027"
    assert Decimal(updated["current_amount"]) == Decimal("5000.00")

    # DELETE
    delete_response = await client.delete(f"/goal/{goal_id}")
    assert delete_response.status_code == 200

    # GET after delete - should 404
    get_after_delete = await client.get(f"/goal/{goal_id}")
    assert get_after_delete.status_code == 404


@pytest.mark.asyncio()
async def test_goal_list_multiple(client: AsyncClient):
    """Testa listagem de múltiplas metas."""
    await client.post(
        "/goal/",
        json={
            "name": "Fundo de Emergência",
            "target_amount": "12000.00",
            "initial_amount": "3000.00",
        },
    )
    await client.post(
        "/goal/",
        json={
            "name": "Carro Novo",
            "target_amount": "50000.00",
            "initial_amount": "15000.00",
            "deadline": "2027-06-01",
        },
    )

    list_response = await client.get("/goal/")
    assert list_response.status_code == 200
    goals = list_response.json()
    assert len(goals) == 2


@pytest.mark.asyncio()
async def test_goal_update_partial(client: AsyncClient):
    """Testa atualização parcial de uma meta (só alguns campos)."""
    create = await client.post(
        "/goal/",
        json={
            "name": "Reserva de Estudos",
            "target_amount": "8000.00",
            "initial_amount": "1000.00",
            "deadline": "2027-01-01",
        },
    )
    goal_id = create.json()["id"]

    # Atualiza só o current_amount, mantendo os outros campos
    patch = await client.patch(
        f"/goal/{goal_id}",
        json={"current_amount": "2000.00"},
    )
    assert patch.status_code == 200
    updated = patch.json()
    assert updated["name"] == "Reserva de Estudos"
    assert Decimal(updated["current_amount"]) == Decimal("2000.00")
    assert Decimal(updated["target_amount"]) == Decimal("8000.00")
    assert updated["deadline"] == "2027-01-01"


@pytest.mark.asyncio()
async def test_goal_without_deadline(client: AsyncClient):
    """Testa criação de meta sem prazo definido."""
    create = await client.post(
        "/goal/",
        json={
            "name": "Meta sem prazo",
            "target_amount": "5000.00",
            "initial_amount": "0.00",
        },
    )
    assert create.status_code == 200
    created = create.json()
    assert created["deadline"] is None


@pytest.mark.asyncio()
async def test_goal_not_found(client: AsyncClient):
    """Testa acesso a uma meta inexistente."""
    fake_id = "00000000-0000-0000-0000-000000000000"
    response = await client.get(f"/goal/{fake_id}")
    assert response.status_code == 404
