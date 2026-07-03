
from sqlalchemy import select, func
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
from src.db.session import get_db
from src.schemas.cards import (
    CardOut,
    ListCardOut
)
from src.db.models import Card
from src.core.exceptions import ImageProcessingError
from src.db.crud.tag import del_orphaned_tags, get_or_create_tags
from src.utils.image_methods import del_images, save_images


router = APIRouter()

@router.get("/cards", response_model=ListCardOut)
async def get_card_list(page: int = 0, limit: int = 20, db: AsyncSession=Depends(get_db)):
    """
    Minimum required information.
    Sorting. Filters.
    """
    
    stmt = (
        select(Card)
        .options(selectinload(Card.tags))
        .offset(page * limit)
        .limit(limit)
        .order_by(Card.created_at.desc())
    )
    res = (await db.execute(stmt)).scalars().all()
    
    count_stmt = select(func.count()).select_from(Card)
    total = (await db.execute(count_stmt)).scalar()
    
    items = []
    for r in res:
        items.append(CardOut(
            id=r.id,
            title=r.title,
            description=r.description,
            difficulty=r.difficulty,
            completed=r.completed,
            created_at=r.created_at,
            updated_at=r.updated_at,
            tags=[tag.name for tag in r.tags],
        ))
    
    return ListCardOut(
        items=items,
        total=total
    )

@router.get("/cards/{id}", response_model=CardOut, status_code=status.HTTP_200_OK)
async def get_card(id: UUID, db: AsyncSession=Depends(get_db)):
    stmt = (
        select(Card)
        .options(selectinload(Card.tags))
        .where(Card.id == id)
    )
    res = await db.execute(stmt)
    item = res.scalar_one_or_none()
    
    if item is None:
        raise HTTPException(404)
    
    return CardOut(
        id=item.id,
        title=item.title,
        description=item.description,
        difficulty=item.difficulty,
        completed=item.completed,
        created_at=item.created_at,
        updated_at=item.updated_at,
        tags=[tag.name for tag in item.tags],
    )

@router.post("/cards", response_model=CardOut, status_code=status.HTTP_201_CREATED)
async def add_card(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    difficulty: int = Form(...),
    completed: bool = Form(...),
    tags: list[str] = Form([]),
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    
    async with db.begin():
        tag_objs = await get_or_create_tags(db, tags)
        
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
            await save_images(image, card_id=item.id)
        except ImageProcessingError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )
            
        return CardOut(
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
    difficulty: Optional[int] = Form(None),
    completed: Optional[bool] = Form(None),
    tags: Optional[list[str]] = Form(None),
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

        if tags is not None:
            old_tag_ids = [t.id for t in item.tags]
            item.tags = await get_or_create_tags(db, tags)
            await db.flush()
            await del_orphaned_tags(db, old_tag_ids)

        if image is not None:
            try:
                await save_images(image, card_id=item.id)
                item.updated_at = func.now()
            except ImageProcessingError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(e),
                )
                
        await db.flush()
        await db.refresh(item, attribute_names=["updated_at", "tags"])
    
        return CardOut(
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

