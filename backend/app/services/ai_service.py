from app.ai.providers.ollama import get_embedding


async def process_transaction_embedding(
    description: str, is_search: bool
) -> list[float]:
    """
    Process the transaction description to generate an embedding vector.

    Args:
        description (str): The transaction description to be embedded.
        is_search (bool):

    Returns:
        list[float]: The embedding vector representing the transaction description.
    """
    embedding_vector = await get_embedding(description, is_search)
    return embedding_vector
