from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from core.types import Difficulty

class ShortOut(BaseModel):
    """Minimum required information of card."""
    id: UUID
    title: str
    difficulty: Difficulty
    completed: bool
    tags: list[str]
    
class ListShortOut(BaseModel):
    items: list[ShortOut]
    total: int
    
    model_config = {"from_attributes": True}
    
class DetailOut(BaseModel):
    """All required information of card."""
    id: UUID
    title: str
    description: str
    difficulty: Difficulty
    completed: bool
    created_at: datetime
    updated_at: datetime
    tags: list[str]
    
    model_config = {"from_attributes": True}