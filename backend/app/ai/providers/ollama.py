import httpx
import os

OLLAMA_HOST = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_API_URL = f"{OLLAMA_HOST}/api/embeddings"


async def get_embedding(text: str, is_search: bool) -> list[float]:
    prefix = "search_query: " if is_search else "search_document: "
    full_text = f"{prefix}{text}"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            OLLAMA_API_URL,
            json={"model": "nomic-embed-text-v2-moe:latest", "prompt": full_text},
        )

        return response.json()["embedding"]
