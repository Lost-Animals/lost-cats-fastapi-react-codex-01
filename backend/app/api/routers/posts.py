import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.cat_post import CatPost
from app.models.enums import PostStatus, PostType
from app.schemas.cat_post import CatPostCreate, CatPostRead, CatProfile, FoundCareInfo, Location

router = APIRouter()


def build_post_read(post: CatPost) -> CatPostRead:
    found_info = None
    if post.is_sheltered is not None or post.needs_vet is not None:
        found_info = FoundCareInfo(
            is_sheltered=post.is_sheltered,
            needs_vet=post.needs_vet,
        )

    return CatPostRead(
        id=post.id,
        type=post.type,
        status=post.status,
        author_user_id=post.author_user_id,
        title=post.title,
        description=post.description,
        event_datetime=post.event_datetime,
        event_datetime_precision=post.event_datetime_precision,
        location=Location(
            latitude=post.latitude,
            longitude=post.longitude,
            location_label=post.location_label,
            accuracy_radius_m=post.accuracy_radius_m,
        ),
        cat_profile=CatProfile(
            name=post.cat_name,
            sex=post.sex,
            age_group=post.age_group,
            size=post.size,
            fur_length=post.fur_length,
            primary_color=post.primary_color,
            secondary_color=post.secondary_color,
            pattern=post.pattern,
            distinctive_marks=post.distinctive_marks,
            is_neutered=post.is_neutered,
            health_notes=post.health_notes,
        ),
        chip_number=post.chip_number,
        passport_number=post.passport_number,
        found_care_info=found_info,
        views_count=post.views_count,
        created_at=post.created_at,
        updated_at=post.updated_at,
        resolved_at=post.resolved_at,
    )


@router.get("", response_model=list[CatPostRead])
def list_posts(
    db: Session = Depends(get_db),
    type: Annotated[PostType | None, Query()] = None,
    status: Annotated[PostStatus | None, Query()] = None,
) -> list[CatPostRead]:
    query = select(CatPost)
    if type:
        query = query.where(CatPost.type == type)
    if status:
        query = query.where(CatPost.status == status)
    query = query.order_by(CatPost.created_at.desc())
    posts = db.execute(query).scalars().all()
    return [build_post_read(post) for post in posts]


@router.post("", response_model=CatPostRead)
def create_post(payload: CatPostCreate, db: Session = Depends(get_db)) -> CatPostRead:
    post = CatPost(
        id=uuid.uuid4(),
        type=payload.type,
        status=payload.status,
        author_user_id=payload.author_user_id,
        title=payload.title,
        description=payload.description,
        event_datetime=payload.event_datetime,
        event_datetime_precision=payload.event_datetime_precision,
        latitude=payload.location.latitude,
        longitude=payload.location.longitude,
        location_label=payload.location.location_label,
        accuracy_radius_m=payload.location.accuracy_radius_m,
        cat_name=payload.cat_profile.name,
        sex=payload.cat_profile.sex,
        age_group=payload.cat_profile.age_group,
        size=payload.cat_profile.size,
        fur_length=payload.cat_profile.fur_length,
        primary_color=payload.cat_profile.primary_color,
        secondary_color=payload.cat_profile.secondary_color,
        pattern=payload.cat_profile.pattern,
        distinctive_marks=payload.cat_profile.distinctive_marks,
        chip_number=payload.chip_number,
        passport_number=payload.passport_number,
        is_neutered=payload.cat_profile.is_neutered,
        health_notes=payload.cat_profile.health_notes,
        is_sheltered=payload.found_care_info.is_sheltered if payload.found_care_info else None,
        needs_vet=payload.found_care_info.needs_vet if payload.found_care_info else None,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return build_post_read(post)


@router.get("/{post_id}", response_model=CatPostRead)
def get_post(post_id: uuid.UUID, db: Session = Depends(get_db)) -> CatPostRead:
    post = db.get(CatPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return build_post_read(post)
