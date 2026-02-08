from fastapi import FastAPI
from db.session import engine
from db.base import Base
from db.models import Card, Tag, card_tag
from routers import include_routers
from core.lifespan import lifespan
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(lifespan=lifespan)

# TODO in config?
origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

include_routers(app)