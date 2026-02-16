"""
API routes package
"""
from fastapi import APIRouter
from app.routes import auth, users, recipes, videos, engagement, search, recommendations

api_router = APIRouter()

# Include all route modules
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(recipes.router, prefix="/recipes", tags=["Recipes"])
api_router.include_router(videos.router, prefix="/videos", tags=["Videos"])
api_router.include_router(engagement.router, prefix="/engagement", tags=["Engagement"])
api_router.include_router(search.router, prefix="/search", tags=["Search"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])