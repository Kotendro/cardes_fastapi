from fastapi import FastAPI
from .api_v1 import router as api_v1_r
from .api_v2 import router as api_v2_r

def include_routers(app: FastAPI):
    # app.include_router(
    #     api_v1_r,
    #     prefix="/api/v1",
    #     tags=["Cardes"],
    # )
    app.include_router(
        api_v2_r,
        prefix="/api/v2",
        tags=["Cardes"],
    )