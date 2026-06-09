import logging

from app.ai.providers import google, ollama

logger = logging.getLogger(__name__)


async def get_embedding(
    text: str, is_search: bool, provider: str = "ollama", api_key: str | None = None
) -> list[float] | None:
    """
    Process the text to generate an embedding vector using the specified provider.

    Returns None if the embedding fails, so callers can decide whether to proceed
    without the vector or raise an error.
    """
    try:
        if provider == "google":
            return await google.get_embedding(text, is_search, api_key)
        else:
            return await ollama.get_embedding(text, is_search)
    except Exception:
        logger.exception(
            "Failed to generate embedding for text (provider=%s, is_search=%s)",
            provider,
            is_search,
        )
        return None


async def process_transaction_embedding(
    description: str, is_search: bool
) -> list[float] | None:
    """
    Process the transaction description to generate an embedding vector using the default provider.

    Returns None if the embedding fails.
    """
    return await get_embedding(description, is_search)
