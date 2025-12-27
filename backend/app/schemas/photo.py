from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class PhotoBase(BaseModel):
    post_id: UUID
    storage_key: str
    thumb_url: str
    position: int
    width: int | None = None
    height: int | None = None


class PhotoCreate(PhotoBase):
    pass


class PhotoRead(PhotoBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
