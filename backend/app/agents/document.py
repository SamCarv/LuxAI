from __future__ import annotations

from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel, GoogleModelSettings
from pydantic_ai.providers.google import GoogleProvider

from app.agents.deps import AgentDeps

DOCUMENT_SYSTEM_INSTRUCTION = (
    "Você é um assistente que responde perguntas sobre documentos. "
    "Use apenas o contexto fornecido para responder. "
    "Se a resposta não estiver no contexto, diga que não encontrou a informação."
)

GEMINI_MODEL = "gemini-3-flash-preview"


def build_document_chat_agent(api_key: str) -> Agent[AgentDeps, str]:
    provider = GoogleProvider(api_key=api_key)
    model = GoogleModel(GEMINI_MODEL, provider=provider)
    settings = GoogleModelSettings(
        google_thinking_config={"thinking_level": "low"}  # type: ignore[arg-type]
    )

    return Agent(
        model,
        deps_type=AgentDeps,
        instructions=DOCUMENT_SYSTEM_INSTRUCTION,
        model_settings=settings,
    )
