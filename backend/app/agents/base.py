import os

MODEL_ENV_KEYS = ("PYDANTICAI_MODEL", "LLM_MODEL")


def resolve_model_name(model_name: str | None = None) -> str:
    if model_name:
        return model_name

    for key in MODEL_ENV_KEYS:
        value = os.getenv(key)
        if value:
            return value

    raise RuntimeError(
        "No LLM model configured. Set PYDANTICAI_MODEL (or LLM_MODEL) "
        "or pass model_name when building agents."
    )
