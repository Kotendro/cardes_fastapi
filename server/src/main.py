from fastapi import FastAPI
from src.db.session import engine
from src.db.base import Base
from src.db.models import Card, Tag, card_tag
from src.routers import include_routers
from src.core.lifespan import lifespan
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI(lifespan=lifespan)

# TODO in config?
origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="./src/static"), name="static")

include_routers(app)


def run_dev():
    # poetry script to run dev
    uvicorn.run("src.main:app", reload=True)