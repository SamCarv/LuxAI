import os
from sqlmodel import create_engine, Session, SQLModel
from dotenv import load_dotenv

load_dotenv()
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST", "localhost")
port = os.getenv("DB_PORT", "5432")
db_name = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}"

engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)


def init_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
