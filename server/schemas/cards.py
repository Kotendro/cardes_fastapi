from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from core.types import Difficulty
    
class CardOut(BaseModel):
    """All required information of card."""
    id: UUID
    title: str
    description: str | None
    difficulty: Difficulty
    completed: bool
    created_at: datetime
    updated_at: datetime
    tags: list[str]
    
    model_config = {"from_attributes": True}
    
class ListCardOut(BaseModel):
    items: list[CardOut]
    total: int
    
    model_config = {"from_attributes": True}