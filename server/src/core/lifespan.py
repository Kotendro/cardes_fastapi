from fastapi import FastAPI
from src.db.session import init_models

async def lifespan(app: FastAPI):
    await init_models()
    yield