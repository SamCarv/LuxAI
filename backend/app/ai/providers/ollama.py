import httpx

OLLAMA_API_URL = "http://localhost:11434/api/embeddings"


async def get_embedding(text: str) -> list[float]:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            OLLAMA_API_URL, json={"model": "qwen3-embedding:4b", "prompt": text}
        )

        return response.json().get("embedding", [])
