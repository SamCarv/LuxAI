from functools import lru_cache

from pydantic_ai import Agent

from app.agents.bank_account import build_bank_account_agent
from app.agents.base import resolve_model_name
from app.agents.category import build_category_agent
from app.agents.goal import build_goal_agent
from app.agents.transaction import build_transaction_agent
from app.agents.user import build_user_agent


@lru_cache
def get_user_agent(model_name: str | None = None) -> Agent:
    return build_user_agent(resolve_model_name(model_name))


@lru_cache
def get_bank_account_agent(model_name: str | None = None) -> Agent:
    return build_bank_account_agent(resolve_model_name(model_name))


@lru_cache
def get_category_agent(model_name: str | None = None) -> Agent:
    return build_category_agent(resolve_model_name(model_name))


@lru_cache
def get_goal_agent(model_name: str | None = None) -> Agent:
    return build_goal_agent(resolve_model_name(model_name))


@lru_cache
def get_transaction_agent(model_name: str | None = None) -> Agent:
    return build_transaction_agent(resolve_model_name(model_name))
