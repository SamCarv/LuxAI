import os

from dotenv import load_dotenv
from sqlalchemy import text
from sqlmodel import create_engine

load_dotenv()

# Pegando a URL do banco que você vai testar
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ Erro: DATABASE_URL não encontrada no seu ambiente/ arquivo .env")
    exit(1)

# Força os ajustes de driver e SSL que o Postgres da nuvem exige
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
if "ondigitalocean.com" in DATABASE_URL and "sslmode=" not in DATABASE_URL:
    DATABASE_URL += "&sslmode=require" if "?" in DATABASE_URL else "?sslmode=require"

print("🔄 Tentando conectar ao banco da DigitalOcean...")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        # Executa um comando simples de teste
        result = conn.execute(text("SELECT 1")).fetchone()
        print(f"✅ Conexão bem-sucedida! Resposta do banco: {result}")

        # Testando se o pgvector está respondendo
        vector_check = conn.execute(
            text("SELECT extname FROM pg_extension WHERE extname = 'vector'")
        ).fetchone()
        print(f"🧠 Status da extensão pgvector: {vector_check}")

except Exception as e:
    print("❌ Falha crítica na conexão!")
    print(f"Erro retornado: {e}")
