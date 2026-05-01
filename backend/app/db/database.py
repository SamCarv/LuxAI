import os
import time

from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlmodel import Session, SQLModel, create_engine

load_dotenv()


def _in_container() -> bool:
    return os.path.exists("/run/.containerenv") or os.path.exists("/.dockerenv")


DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and "${" in DATABASE_URL:
    DATABASE_URL = None

if not DATABASE_URL:
    user = os.getenv("DB_USER", "postgres")
    password = os.getenv("DB_PASSWORD", "password123")
    host_default = "db" if _in_container() else "localhost"
    host = os.getenv("DB_HOST", host_default)
    port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME", "luxai_db")
    DATABASE_URL = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}"

engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)


def init_db():
    retries = int(os.getenv("DB_INIT_RETRIES", "15"))
    retry_delay = float(os.getenv("DB_INIT_RETRY_DELAY", "2"))
    last_error: OperationalError | None = None

    while retries > 0:
        try:
            with engine.connect() as conn:
                with conn.begin():
                    conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))

            SQLModel.metadata.create_all(engine)
            return
        except OperationalError as exc:
            last_error = exc
            retries -= 1
            time.sleep(retry_delay)

    raise Exception(f"Failed to connect to database: {last_error}")


def get_session():
    with Session(engine) as session:
        yield session
