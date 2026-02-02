from fastapi import FastAPI
from db.session import engine
from db.base import Base
from db.models import Card, Tag, card_tag
from routers import include_routers
from core.lifespan import lifespan

app = FastAPI(lifespan=lifespan)

include_routers(app)