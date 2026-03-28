from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.db.database import init_db
from app.models.user import User
from app.models.bank_account import BankAccount
from app.models.category import Category
from app.models.transaction import Transaction

from app.api.v1.routers import transaction

app = FastAPI()

app.include_router(transaction.router)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)
