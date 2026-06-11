from __future__ import annotations

import asyncio
import os
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional
from uuid import UUID

import boto3
from botocore.client import Config


class StorageBackend(ABC):
    @abstractmethod
    async def save(self, user_id: UUID, filename: str, data: bytes) -> str: ...

    @abstractmethod
    async def read(self, storage_path: str) -> bytes: ...

    @abstractmethod
    async def delete(self, storage_path: str) -> None: ...


class LocalStorage(StorageBackend):
    def __init__(self, root: str = "/tmp/uploads") -> None:
        self.root = Path(root)

    def _user_dir(self, user_id: UUID) -> Path:
        user_dir = self.root / str(user_id)
        user_dir.mkdir(parents=True, exist_ok=True)
        return user_dir

    async def save(self, user_id: UUID, filename: str, data: bytes) -> str:
        storage_path = self._user_dir(user_id) / filename
        # Executa em thread para não bloquear o loop assíncrono se o arquivo for grande
        await asyncio.to_thread(storage_path.write_bytes, data)
        return str(storage_path)

    async def read(self, storage_path: str) -> bytes:
        return await asyncio.to_thread(Path(storage_path).read_bytes)

    async def delete(self, storage_path: str) -> None:
        path = Path(storage_path)
        if path.exists():
            await asyncio.to_thread(path.unlink)


class S3Storage(StorageBackend):
    def __init__(
        self,
        endpoint_url: str,
        bucket_name: str,
        region: str = "atl1",
        access_key: Optional[str] = None,
        secret_key: Optional[str] = None,
    ) -> None:
        self.bucket_name = bucket_name

        session = boto3.Session(
            aws_access_key_id=access_key or os.getenv("SPACES_ACCESS_KEY"),
            aws_secret_access_key=secret_key or os.getenv("SPACES_SECRET_KEY"),
        )

        self.client = session.client(
            "s3",
            endpoint_url=endpoint_url,
            region_name=region,
            config=Config(signature_version="s3v4", s3={"addressing_style": "virtual"}),
        )

    def _object_key(self, user_id: UUID, filename: str) -> str:
        return f"documents/{user_id}/{filename}"

    async def save(self, user_id: UUID, filename: str, data: bytes) -> str:
        object_key = self._object_key(user_id, filename)

        await asyncio.to_thread(
            self.client.put_object,
            Bucket=self.bucket_name,
            Key=object_key,
            Body=data,
            ACL="private",
        )
        return object_key

    async def read(self, storage_path: str) -> bytes:
        response = await asyncio.to_thread(
            self.client.get_object,
            Bucket=self.bucket_name,
            Key=storage_path,
        )
        return response["Body"].read()

    async def delete(self, storage_path: str) -> None:
        await asyncio.to_thread(
            self.client.delete_object,
            Bucket=self.bucket_name,
            Key=storage_path,
        )


def get_storage_backend() -> StorageBackend:
    storage_type = os.getenv("STORAGE_TYPE", "local")

    if storage_type == "s3":
        endpoint_url = os.getenv("SPACES_ENDPOINT_URL", "")
        bucket_name = os.getenv("SPACES_BUCKET_NAME", "")
        region = os.getenv("SPACES_REGION", "atl1")

        if not endpoint_url or not bucket_name:
            raise RuntimeError(
                "SPACES_ENDPOINT_URL and SPACES_BUCKET_NAME are required "
                "when STORAGE_TYPE=s3"
            )

        return S3Storage(
            endpoint_url=endpoint_url,
            bucket_name=bucket_name,
            region=region,
        )

    # Padrão: armazenamento local
    root = os.getenv("DOCUMENT_STORAGE_PATH", "/tmp/uploads")
    return LocalStorage(root=root)
