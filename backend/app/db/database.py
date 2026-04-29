import os
import time
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlmodel import create_engine, Session, SQLModel
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    user = os.getenv("DB_USER", "postgres")
    password = os.getenv("DB_PASSWORD", "password123")
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME", "luxai_db")
    DATABASE_URL = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}"

engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)


def init_db():
    retries = 10
    while retries > 0:
        try:
            with engine.connect() as conn:
                with conn.begin():
                    conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))

            SQLModel.metadata.create_all(engine)
            return
        except OperationalError:
            retries -= 1
            time.sleep(2)

    raise Exception("Failed to connect to database")


def get_session():
    with Session(engine) as session:
        yield session
