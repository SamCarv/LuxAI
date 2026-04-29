from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.db.database import init_db
from app.models.user import User
from app.models.bank_account import BankAccount
from app.models.category import Category
from app.models.transaction import Transaction

from app.api.v1.routers import auth, user, transaction, bank_account, category


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(transaction.router)
app.include_router(bank_account.router)
app.include_router(user.router)
app.include_router(category.router)
app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"message": "running!"}
