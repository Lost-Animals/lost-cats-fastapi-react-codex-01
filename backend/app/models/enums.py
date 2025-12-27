from enum import Enum


class ContactPreference(str, Enum):
    IN_PLATFORM_ONLY = "IN_PLATFORM_ONLY"
    SHOW_PHONE_OPTIONAL = "SHOW_PHONE_OPTIONAL"


class UserRole(str, Enum):
    USER = "USER"
    MODERATOR = "MODERATOR"
    ADMIN = "ADMIN"


class PostType(str, Enum):
    LOST = "LOST"
    FOUND = "FOUND"


class PostStatus(str, Enum):
    ACTIVE = "ACTIVE"
    RESOLVED = "RESOLVED"
    ARCHIVED = "ARCHIVED"
    HIDDEN_BY_MODERATION = "HIDDEN_BY_MODERATION"


class EventDatetimePrecision(str, Enum):
    EXACT = "EXACT"
    APPROXIMATE = "APPROXIMATE"


class CatSex(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    UNKNOWN = "UNKNOWN"


class CatAgeGroup(str, Enum):
    KITTEN = "KITTEN"
    ADULT = "ADULT"
    SENIOR = "SENIOR"
    UNKNOWN = "UNKNOWN"


class CatSize(str, Enum):
    SMALL = "SMALL"
    MEDIUM = "MEDIUM"
    LARGE = "LARGE"
    UNKNOWN = "UNKNOWN"


class CatFurLength(str, Enum):
    SHORT = "SHORT"
    MEDIUM = "MEDIUM"
    LONG = "LONG"
    UNKNOWN = "UNKNOWN"


class CatPattern(str, Enum):
    SOLID = "SOLID"
    TABBY = "TABBY"
    TUXEDO = "TUXEDO"
    CALICO = "CALICO"
    OTHER = "OTHER"
    UNKNOWN = "UNKNOWN"
