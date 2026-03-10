from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.database.session import get_db
from app.schemas.recipe import RecipeSearchFilters, RecipeList, DifficultyLevel, DietaryPreference
from app.schemas.user import UserPublic
from app.services.search_service import SearchService
from sqlalchemy import select
from app.models.user import User

router = APIRouter()


@router.get("/recipes", response_model=dict)
async def search_recipes(
    query: Optional[str] = None,
    difficulty: Optional[DifficultyLevel] = None,
    dietary_preference: Optional[DietaryPreference] = None,
    max_cooking_time: Optional[int] = None,
    ingredient: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Search recipes with filters
    """
    filters = RecipeSearchFilters(
        query=query,
        difficulty=difficulty,
        dietary_preference=dietary_preference,
        max_cooking_time=max_cooking_time,
        ingredient=ingredient
    )
    
    recipes, total = await SearchService.search_recipes(db, filters, skip, limit)
    
    # Convert to RecipeList format
    recipe_list = []
    for recipe in recipes:
        # Get author username
        author_result = await db.execute(select(User).where(User.id == recipe.author_id))
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
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit,
        "has_more": skip + limit < total
    }


@router.get("/users", response_model=dict)
async def search_users(
    query: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Search users by username
    """
    users, total = await SearchService.search_users(db, query, skip, limit)
    
    return {
        "users": [UserPublic.model_validate(user) for user in users],
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit,
        "has_more": skip + limit < total
    }


@router.get("/trending", response_model=List[RecipeList])
async def get_trending_recipes(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get trending recipes
    """
    recipes = await SearchService.get_trending_recipes(db, limit)
    
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