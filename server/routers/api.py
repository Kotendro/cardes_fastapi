
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Form,
    File,
    UploadFile
)
from db.session import get_db
from schemas.cards import (
    ListShortOut,
    DetailOut,
    ShortOut,
)
from db.models import Card
from core.types import Difficulty
from core.exceptions import ImageProcessingError
from db.crud.tag import del_orphaned_tags, get_or_create_tags
from utils.image_methods import del_images, save_images


router = APIRouter()

@router.get("/cards", response_model=ListShortOut)
async def get_page(db: AsyncSession=Depends(get_db)):
    """
    Minimum required information.
    Sorting. Filters.
    """
    
    stmt = (
        select(Card)
        .options(selectinload(Card.tags))
        .limit(20)
    )
    res = (await db.execute(stmt)).scalars().all()
    
    items = []
    for r in res:
        items.append(ShortOut(
            id=r.id,
            title=r.title,
            difficulty=r.difficulty,
            completed=r.completed,
            tags=[tag.name for tag in r.tags],
        ))
    
    return ListShortOut(
        items=items,
        total=len(items)
    )

@router.get("/cards/{id}", response_model=DetailOut, status_code=status.HTTP_200_OK)
async def get_detail(id: UUID, db: AsyncSession=Depends(get_db)):
    stmt = (
        select(Card)
        .options(selectinload(Card.tags))
        .where(Card.id == id)
    )
    res = await db.execute(stmt)
    item = res.scalar_one_or_none()
    
    if item is None:
        raise HTTPException(404)
    
    return DetailOut(
        id=item.id,
        title=item.title,
        description=item.description,
        difficulty=item.difficulty,
        completed=item.completed,
        created_at=item.created_at,
        updated_at=item.updated_at,
        tags=[tag.name for tag in item.tags],
    )

@router.post("/cards", response_model=DetailOut, status_code=status.HTTP_201_CREATED)
async def add_card(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    difficulty: Difficulty = Form(...),
    completed: bool = Form(...),
    tag_names: list[str] = Form([]),
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    
    async with db.begin():
        tag_objs = await get_or_create_tags(db, tag_names)
        
        item = Card(
            title=title,
            description=description,
            difficulty=difficulty,
            completed=completed,
            tags=tag_objs
        )
        db.add(item)
        await db.flush()
        
        try:
            await save_images(image, item_id=item.id)
        except ImageProcessingError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )
            
        return DetailOut(
            id=item.id,
            title=item.title,
            description=item.description,
            difficulty=item.difficulty,
            completed=item.completed,
            created_at=item.created_at,
            updated_at=item.updated_at,
            tags=[tag.name for tag in await item.awaitable_attrs.tags],
        )
        
@router.patch("/cards/{id}")
async def patch_card(
    id: UUID,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    difficulty: Optional[Difficulty] = Form(None),
    completed: Optional[bool] = Form(None),
    tag_names: Optional[list[str]] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
):
    
    async with db.begin():
        stmt = (
            select(Card)
            .options(selectinload(Card.tags))
            .where(Card.id == id)
        )
        res = await db.execute(stmt)
        item = res.scalar_one_or_none()
        if item is None:
            raise HTTPException(404)
        
        if title is not None:
            item.title = title
        if description is not None:
            item.description = description
        if difficulty is not None:
            item.difficulty = difficulty
        if completed is not None:
            item.completed = completed

        if tag_names is not None:
            old_tag_ids = [t.id for t in item.tags]
            item.tags = await get_or_create_tags(db, tag_names)
            await db.flush()
            await del_orphaned_tags(db, old_tag_ids)

        if image is not None:
            try:
                await save_images(image, item_id=item.id)
            except ImageProcessingError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(e),
                )
    
        return DetailOut(
            id=item.id,
            title=item.title,
            description=item.description,
            difficulty=item.difficulty,
            completed=item.completed,
            created_at=item.created_at,
            updated_at=item.updated_at,
            tags=[tag.name for tag in item.tags],
        )

@router.delete("/cards/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def del_card(id: UUID, db: AsyncSession=Depends(get_db)):
    async with db.begin():
        stmt = (
            select(Card)
            .options(selectinload(Card.tags))
            .where(Card.id == id)
        )
        res = await db.execute(stmt)
        item = res.scalar_one_or_none()
        
        if item is None:
            raise HTTPException(404)
        
        tag_ids = [t.id for t in item.tags]
        item_id = item.id
        
        await db.delete(item)
        await db.flush()

        await del_orphaned_tags(db, tag_ids)
        
    del_images(item_id)
    
    return 

