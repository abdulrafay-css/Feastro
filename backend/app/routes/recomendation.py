from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database.session import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.recipe import RecipeList
from app.services.recommendation_service import RecommendationService
from sqlalchemy import select
from app.models.user import User as UserModel

router = APIRouter()


@router.get("/feed", response_model=dict)
async def get_personalized_feed(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    exclude_seen: bool = True,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get personalized recipe feed for the current user
    """
    recipes = await RecommendationService.get_personalized_feed(
        db,
        current_user.id,
        skip,
        limit,
        exclude_seen
    )
    
    # Convert to RecipeList format
    recipe_list = []
    for recipe in recipes:
        # Get author username
        author_result = await db.execute(select(UserModel).where(UserModel.id == recipe.author_id))
        author = author_result.scalar_one_or_none()
        
        recipe_list.append({
            "id": recipe.id,
            "title": recipe.title,
            "thumbnail_url": None,
            "cooking_time": recipe.cooking_time,
            "difficulty": recipe.difficulty,
            "likes_count": recipe.likes_count,
            "saves_count": recipe.saves_count,
            "author_username": author.username if author else "Unknown",
            "created_at": recipe.created_at
        })
    
    return {
        "recipes": recipe_list,
        "page": skip // limit + 1,
        "page_size": limit,
        "total": len(recipe_list),
        "has_more": len(recipe_list) == limit
    }


@router.get("/similar/{recipe_id}", response_model=List[RecipeList])
async def get_similar_recipes(
    recipe_id: int,
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    Get recipes similar to the given recipe
    """
    recipes = await RecommendationService.get_similar_recipes(db, recipe_id, limit)
    
    # Convert to RecipeList format
    recipe_list = []
    for recipe in recipes:
        # Get author username
        author_result = await db.execute(select(UserModel).where(UserModel.id == recipe.author_id))
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


@router.get("/preferences")
async def get_user_preferences(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user's detected preferences based on engagement history
    """
    preferences = await RecommendationService.get_user_preferences(db, current_user.id)
    return preferences