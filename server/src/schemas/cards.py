from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

class CardPatch(BaseModel):
    title: str | None = None
    description: str | None = None
    difficulty: int | None = None
    completed: bool | None = None
    tags: list[str] | None = None

class CardAdd(BaseModel):
    title: str
    description: str | None = None
    difficulty: int = 3
    completed: bool = False
    tags: list[str] = []
    
class CardOut(BaseModel):
    """All required information of card."""
    id: UUID
    title: str
    description: str
    difficulty: int
    completed: bool
    created_at: datetime
    updated_at: datetime
    tags: list[str]
    
    model_config = {"from_attributes": True}
    
class ListCardOut(BaseModel):
    items: list[CardOut]
    total: int
    
    model_config = {"from_attributes": True}