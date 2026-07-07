
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from uuid import UUID
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
    CardAdd,
    CardOut,
    CardPatch,
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
    card = res.scalar_one_or_none()
    if card is None:
        raise HTTPException(404)
    
    return CardOut(
        id=card.id,
        title=card.title,
        description=card.description,
        difficulty=card.difficulty,
        completed=card.completed,
        created_at=card.created_at,
        updated_at=card.updated_at,
        tags=[tag.name for tag in card.tags],
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
        card = res.scalar_one_or_none()
        if card is None:
            raise HTTPException(404)
        
        tag_ids = [t.id for t in card.tags]
        card_id = card.id
        
        await db.delete(card)
        await db.flush()

        await del_orphaned_tags(db, tag_ids)
        
    del_images(card_id)
    return 

@router.post("/cards/{id}/upload_image", status_code=status.HTTP_200_OK)
async def upload_image(id: UUID, image: UploadFile = File(...), db: AsyncSession=Depends(get_db)):
    
    async with db.begin():
        # Проверка существования карточки
        stmt = (
            select(Card)
            .options(selectinload(Card.tags))
            .where(Card.id == id)
        )
        res = await db.execute(stmt)
        card = res.scalar_one_or_none()
        if card is None:
            raise HTTPException(404) 
        
        # Сохранение картинки
        try:
            await save_images(image, card.id)
        except ImageProcessingError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )

@router.patch("/cards/{id}", status_code=status.HTTP_200_OK)
async def patch_card(id: UUID, data: CardPatch, db: AsyncSession=Depends(get_db)):
    async with db.begin():
        stmt = (
            select(Card)
            .options(selectinload(Card.tags))
            .where(Card.id == id)
        )
        res = await db.execute(stmt)
        card = res.scalar_one_or_none()
        if card is None:
            raise HTTPException(404)
        
        if (data.title is not None) and (data.title.strip() != ""):
            card.title = data.title
        if data.description is not None:
            card.description = data.description
        if data.difficulty is not None:
            card.difficulty = data.difficulty
        if data.completed is not None:
            card.completed = data.completed

        if data.tags is not None:
            old_tag_ids = [t.id for t in card.tags]
            card.tags = await get_or_create_tags(db, data.tags)
            await db.flush()
            await del_orphaned_tags(db, old_tag_ids)
                
        await db.flush()
        await db.refresh(card, attribute_names=["updated_at", "tags"])
    
        return CardOut(
            id=card.id,
            title=card.title,
            description=card.description,
            difficulty=card.difficulty,
            completed=card.completed,
            created_at=card.created_at,
            updated_at=card.updated_at,
            tags=[tag.name for tag in await card.awaitable_attrs.tags],
        )

@router.post("/cards", status_code=status.HTTP_201_CREATED)
async def add_card(data: CardAdd, db: AsyncSession=Depends(get_db)):
    if (data.title.strip() == ""):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="title is empty"
        )
    
    async with db.begin():
        tag_objs = await get_or_create_tags(db, data.tags)
        
        card = Card(
            title=data.title,
            description=data.description,
            difficulty=data.difficulty,
            completed=data.completed,
            tags=tag_objs
        )
        db.add(card)
        await db.flush()
            
        return CardOut(
            id=card.id,
            title=card.title,
            description=card.description,
            difficulty=card.difficulty,
            completed=card.completed,
            created_at=card.created_at,
            updated_at=card.updated_at,
            tags=[tag.name for tag in await card.awaitable_attrs.tags],
        )