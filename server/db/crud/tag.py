from sqlalchemy import delete, select
from db.models import Tag
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert as pg_insert

def normalize_tags(tag_names: list[str]) -> list[str]:
    if len(tag_names) == 1:
        tag_names: list[str] = tag_names[0].split(",")
        
    res = []
    for name in tag_names:
        name = name.strip().lower()
        if name:
            res.append(name)
    
    return res

async def get_or_create_tags(session: AsyncSession, tag_names: list[str]) -> list[Tag]:
    normalized = normalize_tags(tag_names)
    if not normalized:
        return []
    
    stmt = (
        pg_insert(Tag)
        .values([{"name": name} for name in normalized])
        .on_conflict_do_nothing(index_elements=[Tag.name])
    )
    await session.execute(stmt)
    
    res = await session.execute(
        select(Tag)
        .where(Tag.name.in_(normalized))
    )
    return res.scalars().all()

async def del_orphaned_tags(session: AsyncSession, tag_ids: list[int]):
    if not tag_ids:
        return
    
    await session.execute(
        delete(Tag)
        .where(
            Tag.id.in_(tag_ids),
            ~Tag.cards.any()
        )
    )
    return