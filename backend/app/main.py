import asyncio
import os
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routers import (
    auth,
    bank_account,
    category,
    chat,
    dashboard,
    document,
    goal,
    transaction,
    user,
)
from app.db.database import init_db
from app.models.bank_account import BankAccount
from app.models.category import Category
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.models.goal import Goal
from app.models.transaction import Transaction
from app.models.user import User
from app.services.recurrence_service import run_recurrence_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

    task = None
    if os.getenv("RECURRENCE_SCHEDULER_ENABLED", "true").lower() in {
        "true",
        "1",
        "yes",
        "on",
    }:
        task = asyncio.create_task(run_recurrence_scheduler())

    yield

    if task:
        task.cancel()
        with suppress(asyncio.CancelledError):
            await task


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transaction.router)
app.include_router(bank_account.router)
app.include_router(user.router)
app.include_router(category.router)
app.include_router(goal.router)
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(dashboard.router)
app.include_router(document.router)


@app.get("/")
def read_root():
    return {"message": "running!"}
