import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# PostgreSQL database URI (default) with SQLite fallback
DEFAULT_PG_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/bharatnewz"
)

try:
    engine = create_engine(DEFAULT_PG_URL, echo=False)
    # Test connection
    with engine.connect() as conn:
        pass
    print(f"[Database] Connected to PostgreSQL: {DEFAULT_PG_URL}")
except Exception as err:
    print(f"[Database] Could not connect to PostgreSQL ({err}). Falling back to SQLite.")
    SQLITE_URL = "sqlite:///./bharatnewz.db"
    engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
