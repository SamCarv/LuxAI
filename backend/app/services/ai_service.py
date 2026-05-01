from app.ai.providers import google, ollama


async def get_embedding(
    text: str, is_search: bool, provider: str = "ollama", api_key: str | None = None
) -> list[float]:
    """
    Process the text to generate an embedding vector using the specified provider.
    """
    if provider == "google":
        return await google.get_embedding(text, is_search, api_key)
    else:
        return await ollama.get_embedding(text, is_search)


async def process_transaction_embedding(
    description: str, is_search: bool
) -> list[float]:
    """
    Process the transaction description to generate an embedding vector using the default provider.
    """
    return await get_embedding(description, is_search)
