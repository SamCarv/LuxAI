from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.db.database import init_db
from app.models.user import User
from app.models.bank_account import BankAccount

app = FastAPI()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)
