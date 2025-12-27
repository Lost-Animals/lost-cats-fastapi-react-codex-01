from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.routers.posts import build_post_read
from app.models.cat_post import CatPost
from app.models.enums import PostStatus
from app.schemas.cat_post import CatPostRead

router = APIRouter()


@router.get("/{chip_number}", response_model=list[CatPostRead])
def lookup_chip(chip_number: str, db: Session = Depends(get_db)) -> list[CatPostRead]:
    query = select(CatPost).where(
        CatPost.chip_number == chip_number,
        CatPost.status == PostStatus.ACTIVE,
    )
    posts = db.execute(query).scalars().all()
    return [build_post_read(post) for post in posts]
