import os

from google import genai
from google.genai import types

DEFAULT_EMBEDDING_DIM = int(os.getenv("EMBEDDING_DIM", "768"))


async def get_embedding(
    text: str, is_search: bool, api_key: str | None = None
) -> list[float]:
    key = api_key or os.getenv("GOOGLE_API_KEY")
    if not key:
        raise ValueError("Google API Key not found")

    client = genai.Client(api_key=key)

    if is_search:
        full_text = f"task: search result | query: {text}"
    else:
        title = "none"
        full_text = f"title: {title} | text: {text}"

    result = client.models.embed_content(
        model="gemini-embedding-2",
        contents=full_text,
        config=types.EmbedContentConfig(output_dimensionality=DEFAULT_EMBEDDING_DIM),
    )

    embedding = result.embeddings[0].values
    if len(embedding) != DEFAULT_EMBEDDING_DIM:
        embedding = embedding[:DEFAULT_EMBEDDING_DIM]
        if len(embedding) < DEFAULT_EMBEDDING_DIM:
            embedding = embedding + [0.0] * (DEFAULT_EMBEDDING_DIM - len(embedding))

    return embedding
