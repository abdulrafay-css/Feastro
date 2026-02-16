from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from app.models.recipe import Recipe
from app.models.user import User
from app.models.video import Video
from app.models.engagement import Like, Save
from app.schemas.recipe import RecipeCreate, RecipeUpdate, RecipeDetail, RecipeList


class RecipeService:
    """
    Recipe service handling recipe CRUD operations
    """
    
    @staticmethod
    async def create_recipe(
        db: AsyncSession,
        recipe_data: RecipeCreate,
        author_id: int
    ) -> Recipe:
        """
        Create a new recipe
        """
        # Convert Pydantic models to dict for JSON storage
        ingredients_dict = [ing.dict() for ing in recipe_data.ingredients]
        instructions_dict = [inst.dict() for inst in recipe_data.instructions]
        
        # Create recipe
        new_recipe = Recipe(
            title=recipe_data.title,
            description=recipe_data.description,
            ingredients=ingredients_dict,
            instructions=instructions_dict,
            cooking_time=recipe_data.cooking_time,
            servings=recipe_data.servings,
            difficulty=recipe_data.difficulty,
            dietary_preference=recipe_data.dietary_preference,
            tags=recipe_data.tags,
            author_id=author_id
        )
        
        db.add(new_recipe)
        await db.flush()  # Flush to get the ID
        
        # If video URL is provided, create video record
        # TODO: Implement video upload and processing
        
        await db.commit()
        await db.refresh(new_recipe)
        
        return new_recipe
    
    @staticmethod
    async def get_recipe_by_id(
        db: AsyncSession,
        recipe_id: int,
        current_user_id: Optional[int] = None
    ) -> Optional[RecipeDetail]:
        """
        Get recipe by ID with full details
        """
        result = await db.execute(
            select(Recipe)
            .options(selectinload(Recipe.author), selectinload(Recipe.video))
            .where(Recipe.id == recipe_id)
        )
        recipe = result.scalar_one_or_none()
        
        if not recipe:
            return None
        
        # Check if user liked/saved
        is_liked = False
        is_saved = False
        
        if current_user_id:
            like_result = await db.execute(
                select(Like).where(
                    and_(Like.user_id == current_user_id, Like.recipe_id == recipe_id)
                )
            )
            is_liked = like_result.scalar_one_or_none() is not None
            
            save_result = await db.execute(
                select(Save).where(
                    and_(Save.user_id == current_user_id, Save.recipe_id == recipe_id)
                )
            )
            is_saved = save_result.scalar_one_or_none() is not None
        
        # Build response
        return RecipeDetail(
            id=recipe.id,
            title=recipe.title,
            description=recipe.description,
            ingredients=recipe.ingredients,
            instructions=recipe.instructions,
            cooking_time=recipe.cooking_time,
            servings=recipe.servings,
            difficulty=recipe.difficulty,
            dietary_preference=recipe.dietary_preference,
            calories=recipe.calories,
            protein=recipe.protein,
            carbs=recipe.carbs,
            fat=recipe.fat,
            tags=recipe.tags,
            author_id=recipe.author_id,
            author_username=recipe.author.username,
            author_avatar=recipe.author.avatar_url,
            video_url=recipe.video.video_url if recipe.video else None,
            thumbnail_url=recipe.video.thumbnail_url if recipe.video else None,
            likes_count=recipe.likes_count,
            saves_count=recipe.saves_count,
            views_count=recipe.views_count,
            is_liked=is_liked,
            is_saved=is_saved,
            is_published=recipe.is_published,
            created_at=recipe.created_at,
            updated_at=recipe.updated_at
        )
    
    @staticmethod
    async def update_recipe(
        db: AsyncSession,
        recipe: Recipe,
        recipe_data: RecipeUpdate
    ) -> Recipe:
        """
        Update recipe
        """
        # Update fields if provided
        if recipe_data.title is not None:
            recipe.title = recipe_data.title
        if recipe_data.description is not None:
            recipe.description = recipe_data.description
        if recipe_data.ingredients is not None:
            recipe.ingredients = [ing.dict() for ing in recipe_data.ingredients]
        if recipe_data.instructions is not None:
            recipe.instructions = [inst.dict() for inst in recipe_data.instructions]
        if recipe_data.cooking_time is not None:
            recipe.cooking_time = recipe_data.cooking_time
        if recipe_data.servings is not None:
            recipe.servings = recipe_data.servings
        if recipe_data.difficulty is not None:
            recipe.difficulty = recipe_data.difficulty
        if recipe_data.dietary_preference is not None:
            recipe.dietary_preference = recipe_data.dietary_preference
        if recipe_data.tags is not None:
            recipe.tags = recipe_data.tags
        if recipe_data.is_published is not None:
            recipe.is_published = recipe_data.is_published
        
        await db.commit()
        await db.refresh(recipe)
        
        return recipe
    
    @staticmethod
    async def delete_recipe(db: AsyncSession, recipe: Recipe) -> bool:
        """
        Delete recipe
        """
        await db.delete(recipe)
        await db.commit()
        return True
    
    @staticmethod
    async def get_recipes(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 10,
        author_id: Optional[int] = None
    ) -> List[Recipe]:
        """
        Get list of recipes with pagination
        """
        query = select(Recipe).where(Recipe.is_published == True)
        
        if author_id:
            query = query.where(Recipe.author_id == author_id)
        
        query = query.offset(skip).limit(limit).order_by(Recipe.created_at.desc())
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def increment_view_count(db: AsyncSession, recipe_id: int) -> bool:
        """
        Increment recipe view count
        """
        result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
        recipe = result.scalar_one_or_none()
        
        if recipe:
            recipe.views_count += 1
            await db.commit()
            return True
        
        return False