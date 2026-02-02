from fastapi import FastAPI
from db.session import init_models

async def lifespan(app: FastAPI):
    await init_models()
    yield