from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database.session import get_db
from app.core.dependencies import get_current_active_user, get_optional_current_user
from app.models.user import User
from app.models.recipe import Recipe
from app.schemas.engagement import (
    LikeCreate,
    LikeResponse,
    SaveCreate,
    SaveResponse,
    EngagementStats,
    EngagementLogCreate,
    EngagementLogResponse
)
from app.schemas.recipe import RecipeList
from app.services.engagement_service import EngagementService
from app.services.recomendation_service import RecommendationService
from sqlalchemy import select

router = APIRouter()


@router.post("/like", response_model=LikeResponse, status_code=status.HTTP_201_CREATED)
async def like_recipe(
    like_data: LikeCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Like a recipe
    """
    like = await EngagementService.like_recipe(db, current_user.id, like_data.recipe_id)
    
    # Log engagement
    from app.schemas.engagement import EngagementType
    await RecommendationService.log_engagement(
        db,
        current_user.id,
        EngagementLogCreate(
            recipe_id=like_data.recipe_id,
            engagement_type=EngagementType.LIKE
        )
    )
    
    return like


@router.delete("/like/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unlike_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Unlike a recipe
    """
    await EngagementService.unlike_recipe(db, current_user.id, recipe_id)
    return None


@router.post("/save", response_model=SaveResponse, status_code=status.HTTP_201_CREATED)
async def save_recipe(
    save_data: SaveCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Save a recipe
    """
    save = await EngagementService.save_recipe(db, current_user.id, save_data.recipe_id)
    
    # Log engagement
    from app.schemas.engagement import EngagementType
    await RecommendationService.log_engagement(
        db,
        current_user.id,
        EngagementLogCreate(
            recipe_id=save_data.recipe_id,
            engagement_type=EngagementType.SAVE
        )
    )
    
    return save


@router.delete("/save/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Unsave a recipe
    """
    await EngagementService.unsave_recipe(db, current_user.id, recipe_id)
    return None


@router.get("/stats/{recipe_id}", response_model=EngagementStats)
async def get_engagement_stats(
    recipe_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_optional_current_user)
):
    """
    Get engagement statistics for a recipe
    """
    stats = await EngagementService.get_engagement_stats(
        db,
        recipe_id,
        current_user.id if current_user else None
    )
    return stats


@router.get("/saved", response_model=List[RecipeList])
async def get_saved_recipes(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user's saved recipes
    """
    recipes = await EngagementService.get_saved_recipes(db, current_user.id, skip, limit)
    
    # Convert to RecipeList format
    recipe_list = []
    for recipe in recipes:
        # Get author username
        author_result = await db.execute(select(User).where(User.id == recipe.author_id))
        author = author_result.scalar_one_or_none()
        
        recipe_list.append(RecipeList(
            id=recipe.id,
            title=recipe.title,
            thumbnail_url=None,
            cooking_time=recipe.cooking_time,
            difficulty=recipe.difficulty,
            likes_count=recipe.likes_count,
            saves_count=recipe.saves_count,
            author_username=author.username if author else "Unknown",
            created_at=recipe.created_at
        ))
    
    return recipe_list


@router.post("/log", response_model=EngagementLogResponse, status_code=status.HTTP_201_CREATED)
async def log_engagement(
    log_data: EngagementLogCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Log user engagement (view, watch duration, etc.)
    """
    log = await RecommendationService.log_engagement(db, current_user.id, log_data)
    return log