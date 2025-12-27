from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.enums import ContactPreference, UserRole


class UserBase(BaseModel):
    email: EmailStr
    display_name: str
    avatar_url: str | None = None
    phone: str | None = None
    contact_preference: ContactPreference
    is_email_verified: bool
    role: UserRole


class UserCreate(UserBase):
    password_hash: str


class UserRead(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    last_login_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)
