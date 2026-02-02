from .base import Base
from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from sqlalchemy.types import String, Text, DateTime, Enum
from datetime import datetime
from core.types import Difficulty
from uuid import UUID, uuid4
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

class Card(Base):
    __tablename__ = "card"
    
    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    difficulty: Mapped[Difficulty] = mapped_column(
        Enum(Difficulty, name="difficulty_enum"),
        nullable=False
    )
    completed: Mapped[bool] = mapped_column(nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )
    
    tags: Mapped[list["Tag"]] = relationship(
        back_populates="cards",
        secondary="card_tag",
    )
    
        

class Tag(Base):
    __tablename__ = "tag"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    
    cards: Mapped[list["Card"]] = relationship(
        back_populates="tags",
        secondary="card_tag"
    )
    
    
card_tag = Table(
    "card_tag",
    Base.metadata,
    Column("card_id", ForeignKey("card.id"), primary_key=True),
    Column("tag_id", ForeignKey("tag.id"), primary_key=True)
)