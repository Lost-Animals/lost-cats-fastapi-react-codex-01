from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_database_url


def create_engine_from_env():
    database_url = get_database_url()
    return create_engine(database_url, pool_pre_ping=True)


engine = create_engine_from_env()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
