import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base
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


class CatPost(Base):
    __tablename__ = "posts"
    __table_args__ = (
        Index("ix_posts_type_status_event_datetime", "type", "status", "event_datetime"),
        Index("ix_posts_chip_number", "chip_number"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type: Mapped[PostType] = mapped_column(Enum(PostType, name="post_type"), nullable=False)
    status: Mapped[PostStatus] = mapped_column(Enum(PostStatus, name="post_status"), nullable=False)
    author_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    event_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    event_datetime_precision: Mapped[EventDatetimePrecision] = mapped_column(
        Enum(EventDatetimePrecision, name="event_datetime_precision"),
        nullable=False,
    )

    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    location_label: Mapped[str] = mapped_column(String(255), nullable=False)
    accuracy_radius_m: Mapped[int] = mapped_column(Integer, nullable=False)

    cat_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sex: Mapped[CatSex] = mapped_column(
        Enum(CatSex, name="cat_sex"),
        nullable=False,
    )
    age_group: Mapped[CatAgeGroup] = mapped_column(
        Enum(CatAgeGroup, name="cat_age_group"),
        nullable=False,
    )
    size: Mapped[CatSize] = mapped_column(
        Enum(CatSize, name="cat_size"),
        nullable=False,
    )
    fur_length: Mapped[CatFurLength] = mapped_column(
        Enum(CatFurLength, name="cat_fur_length"),
        nullable=False,
    )
    primary_color: Mapped[str] = mapped_column(String(50), nullable=False)
    secondary_color: Mapped[str | None] = mapped_column(String(50), nullable=True)
    pattern: Mapped[CatPattern] = mapped_column(
        Enum(CatPattern, name="cat_pattern"),
        nullable=False,
    )
    distinctive_marks: Mapped[str | None] = mapped_column(Text, nullable=True)

    chip_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    passport_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_neutered: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    health_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    is_sheltered: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    needs_vet: Mapped[bool | None] = mapped_column(Boolean, nullable=True)

    views_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    author = relationship("User", back_populates="posts")
    photos = relationship("Photo", back_populates="post", cascade="all, delete-orphan")
