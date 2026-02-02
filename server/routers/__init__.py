from fastapi import FastAPI
from .api import router as api_r

def include_routers(app: FastAPI):
    app.include_router(
        api_r,
        prefix="/api/v1",
        tags=["Cardes"],
    )