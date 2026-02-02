from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
)
from core.settings import settings
from .base import Base

engine = create_async_engine(
    settings.db.pg_dst,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session