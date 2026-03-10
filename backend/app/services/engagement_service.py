from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, delete
from fastapi import HTTPException, status
from app.models.engagement import Like, Save
from app.models.recipe import Recipe
from app.schemas.engagement import LikeResponse, SaveResponse, EngagementStats


class EngagementService:
    """
    Engagement service handling likes, saves, and engagement tracking
    """
    
    @staticmethod
    async def like_recipe(db: AsyncSession, user_id: int, recipe_id: int) -> LikeResponse:
        """
        Like a recipe
        """
        # Check if recipe exists
        result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
        recipe = result.scalar_one_or_none()
        
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        
        # Check if already liked
        result = await db.execute(
            select(Like).where(and_(Like.user_id == user_id, Like.recipe_id == recipe_id))
        )
        existing_like = result.scalar_one_or_none()
        
        if existing_like:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Recipe already liked"
            )
        
        # Create like
        new_like = Like(user_id=user_id, recipe_id=recipe_id)
        db.add(new_like)
        
        # Increment like count
        recipe.likes_count += 1
        
        await db.commit()
        await db.refresh(new_like)
        
        return LikeResponse.model_validate(new_like)
    
    @staticmethod
    async def unlike_recipe(db: AsyncSession, user_id: int, recipe_id: int) -> bool:
        """
        Unlike a recipe
        """
        # Find like
        result = await db.execute(
            select(Like).where(and_(Like.user_id == user_id, Like.recipe_id == recipe_id))
        )
        like = result.scalar_one_or_none()
        
        if not like:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Like not found"
            )
        
        # Get recipe and decrement count
        result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
        recipe = result.scalar_one_or_none()
        
        if recipe and recipe.likes_count > 0:
            recipe.likes_count -= 1
        
        # Delete like
        await db.delete(like)
        await db.commit()
        
        return True
    
    @staticmethod
    async def save_recipe(db: AsyncSession, user_id: int, recipe_id: int) -> SaveResponse:
        """
        Save a recipe
        """
        # Check if recipe exists
        result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
        recipe = result.scalar_one_or_none()
        
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        
        # Check if already saved
        result = await db.execute(
            select(Save).where(and_(Save.user_id == user_id, Save.recipe_id == recipe_id))
        )
        existing_save = result.scalar_one_or_none()
        
        if existing_save:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Recipe already saved"
            )
        
        # Create save
        new_save = Save(user_id=user_id, recipe_id=recipe_id)
        db.add(new_save)
        
        # Increment save count
        recipe.saves_count += 1
        
        await db.commit()
        await db.refresh(new_save)
        
        return SaveResponse.model_validate(new_save)
    
    @staticmethod
    async def unsave_recipe(db: AsyncSession, user_id: int, recipe_id: int) -> bool:
        """
        Unsave a recipe
        """
        # Find save
        result = await db.execute(
            select(Save).where(and_(Save.user_id == user_id, Save.recipe_id == recipe_id))
        )
        save = result.scalar_one_or_none()
        
        if not save:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Save not found"
            )
        
        # Get recipe and decrement count
        result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
        recipe = result.scalar_one_or_none()
        
        if recipe and recipe.saves_count > 0:
            recipe.saves_count -= 1
        
        # Delete save
        await db.delete(save)
        await db.commit()
        
        return True
    
    @staticmethod
    async def get_engagement_stats(
        db: AsyncSession,
        recipe_id: int,
        user_id: Optional[int] = None
    ) -> EngagementStats:
        """
        Get engagement stats for a recipe
        """
        # Get recipe
        result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
        recipe = result.scalar_one_or_none()
        
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        
        # Check user engagement
        is_liked = False
        is_saved = False
        
        if user_id:
            like_result = await db.execute(
                select(Like).where(and_(Like.user_id == user_id, Like.recipe_id == recipe_id))
            )
            is_liked = like_result.scalar_one_or_none() is not None
            
            save_result = await db.execute(
                select(Save).where(and_(Save.user_id == user_id, Save.recipe_id == recipe_id))
            )
            is_saved = save_result.scalar_one_or_none() is not None
        
        return EngagementStats(
            likes_count=recipe.likes_count,
            saves_count=recipe.saves_count,
            views_count=recipe.views_count,
            is_liked=is_liked,
            is_saved=is_saved
        )
    
    @staticmethod
    async def get_saved_recipes(
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> List[Recipe]:
        """
        Get user's saved recipes
        """
        result = await db.execute(
            select(Recipe)
            .join(Save, Save.recipe_id == Recipe.id)
            .where(Save.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .order_by(Save.created_at.desc())
        )
        return result.scalars().all()