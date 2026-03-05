from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.database.session import get_db
from app.core.dependencies import get_current_user, get_current_active_user, get_optional_current_user
from app.models.user import User
from app.models.recipe import Recipe
from app.schemas.recipe import (
    RecipeCreate,
    RecipeUpdate,
    RecipeResponse,
    RecipeDetail,
    RecipeList
)
from app.services.recipe_service import RecipeService
from sqlalchemy import select

router = APIRouter()


@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    recipe_data: RecipeCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new recipe
    """
    recipe = await RecipeService.create_recipe(db, recipe_data, current_user.id)
    return recipe


@router.get("/", response_model=List[RecipeList])
async def get_recipes(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    author_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Get list of recipes with pagination
    """
    recipes = await RecipeService.get_recipes(db, skip, limit, author_id)
    
    # Convert to RecipeList format
    recipe_list = []
    for recipe in recipes:
        # Get author username
        author_result = await db.execute(select(User).where(User.id == recipe.author_id))
        author = author_result.scalar_one_or_none()
        
        recipe_list.append(RecipeList(
            id=recipe.id,
            title=recipe.title,
            thumbnail_url=None,  # TODO: Get from video
            cooking_time=recipe.cooking_time,
            difficulty=recipe.difficulty,
            likes_count=recipe.likes_count,
            saves_count=recipe.saves_count,
            author_username=author.username if author else "Unknown",
            created_at=recipe.created_at
        ))
    
    return recipe_list


@router.get("/{recipe_id}", response_model=RecipeDetail)
async def get_recipe(
    recipe_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Get recipe by ID
    """
    recipe = await RecipeService.get_recipe_by_id(
        db,
        recipe_id,
        current_user.id if current_user else None
    )
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Increment view count
    await RecipeService.increment_view_count(db, recipe_id)
    
    return recipe


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: int,
    recipe_data: RecipeUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update recipe
    """
    # Get recipe
    result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
    recipe = result.scalar_one_or_none()
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Check ownership
    if recipe.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this recipe"
        )
    
    # Update recipe
    updated_recipe = await RecipeService.update_recipe(db, recipe, recipe_data)
    return updated_recipe


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete recipe
    """
    # Get recipe
    result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
    recipe = result.scalar_one_or_none()
    
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Check ownership
    if recipe.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this recipe"
        )
    
    # Delete recipe
    await RecipeService.delete_recipe(db, recipe)
    
    return None


@router.get("/feed/discover", response_model=List[RecipeList])
async def get_discover_feed(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get discover feed (all published recipes)
    """
    recipes = await RecipeService.get_recipes(db, skip, limit)
    
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