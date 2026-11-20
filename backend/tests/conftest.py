import os
import sys
from pathlib import Path

import pytest
import psycopg2
from psycopg2 import sql

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

TEST_DB = "todo_test"
_ADMIN = "postgresql://postgres:postgres@localhost:5435/postgres"

# Must be set before `app` is imported: the engine is built at import time.
os.environ["DATABASE_URL"] = (
    f"postgresql+psycopg2://postgres:postgres@localhost:5435/{TEST_DB}"
)


def _ensure_database() -> None:
    conn = psycopg2.connect(_ADMIN)
    conn.autocommit = True
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (TEST_DB,))
            if cur.fetchone() is None:
                cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(TEST_DB)))
    finally:
        conn.close()


_ensure_database()

from fastapi.testclient import TestClient  # noqa: E402

from app.database import SessionLocal  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Task  # noqa: E402


@pytest.fixture
def db():
    session = SessionLocal()
    session.query(Task).delete()
    session.commit()
    try:
        yield session
    finally:
        session.query(Task).delete()
        session.commit()
        session.close()


@pytest.fixture
def client(db):
    return TestClient(app, raise_server_exceptions=False)
