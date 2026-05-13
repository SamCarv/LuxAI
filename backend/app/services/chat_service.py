import os
from datetime import datetime, timezone

from fastapi import HTTPException
from pydantic_ai.messages import (
    ModelMessage,
    ModelRequest,
    ModelResponse,
    TextPart,
    UserPromptPart,
)
from sqlmodel import Session

from app.agents.chat import build_chat_agent
from app.agents.deps import AgentDeps
from app.core.security import decrypt_string
from app.models.user import User


def _resolve_api_key(current_user: User) -> str:
    if current_user.encrypted_google_api_key:
        return decrypt_string(current_user.encrypted_google_api_key)

    env_key = os.getenv("GOOGLE_API_KEY", "")
    if not env_key:
        raise HTTPException(status_code=400, detail="Google API Key not configured")
    return env_key


def _build_message_history(
    history: list[dict[str, str]] | None,
) -> list[ModelMessage] | None:
    if not history:
        return None

    messages: list[ModelMessage] = []
    now = datetime.now(timezone.utc)
    for item in history:
        role = item.get("role", "user")
        content = item.get("content", "")
        if role == "assistant":
            messages.append(
                ModelResponse(parts=[TextPart(content=content)], timestamp=now)
            )
        else:
            messages.append(
                ModelRequest(parts=[UserPromptPart(content=content)], timestamp=now)
            )

    return messages


async def run_chat(
    message: str,
    session: Session,
    current_user: User,
    history: list[dict[str, str]] | None = None,
) -> str:
    api_key = _resolve_api_key(current_user)
    agent = build_chat_agent(api_key)
    deps = AgentDeps(session=session, current_user=current_user)
    message_history = _build_message_history(history)

    async with agent:
        result = await agent.run(
            message,
            deps=deps,
            message_history=message_history,
        )

    return result.output
