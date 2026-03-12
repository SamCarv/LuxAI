from fastapi import FastAPI
from app.db.database import init_db

app = FastAPI()


@app.on_event("startup")
def on_startup():
    init_db()
    print("Banco de dados conectou")
