from fastapi import APIRouter

from app.api.routers import chip, posts

api_router = APIRouter()

api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(chip.router, prefix="/chip", tags=["chip"])
