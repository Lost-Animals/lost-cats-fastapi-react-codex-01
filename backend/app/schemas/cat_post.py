from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import (
    CatAgeGroup,
    CatFurLength,
    CatPattern,
    CatSex,
    CatSize,
    EventDatetimePrecision,
    PostStatus,
    PostType,
)


class Location(BaseModel):
    latitude: float
    longitude: float
    location_label: str
    accuracy_radius_m: int


class CatProfile(BaseModel):
    name: str | None = None
    sex: CatSex
    age_group: CatAgeGroup
    size: CatSize
    fur_length: CatFurLength
    primary_color: str
    secondary_color: str | None = None
    pattern: CatPattern
    distinctive_marks: str | None = None
    is_neutered: bool | None = None
    health_notes: str | None = None


class FoundCareInfo(BaseModel):
    is_sheltered: bool | None = None
    needs_vet: bool | None = None


class CatPostBase(BaseModel):
    type: PostType
    status: PostStatus
    author_user_id: UUID
    title: str
    description: str
    event_datetime: datetime
    event_datetime_precision: EventDatetimePrecision
    location: Location
    cat_profile: CatProfile
    chip_number: str | None = None
    passport_number: str | None = None
    found_care_info: FoundCareInfo | None = None


class CatPostCreate(CatPostBase):
    pass


class CatPostRead(CatPostBase):
    id: UUID
    views_count: int
    created_at: datetime
    updated_at: datetime
    resolved_at: datetime | None = None

    class Config:
        orm_mode = True
