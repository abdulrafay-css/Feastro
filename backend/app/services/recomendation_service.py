from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, not_
from app.models.recipe import Recipe
from app.models.recommendation import EngagementLog, RecommendationWeight, EngagementType
from app.models.engagement import Like, Save
from app.schemas.engagement import EngagementLogCreate
from datetime import datetime


class RecommendationService:
    """
    Recommendation service handling personalized recipe recommendations
    """
    
    # Weight multipliers for different engagement types
    WEIGHT_CONFIG = {
        "view": 1.0,
        "like": 5.0,
        "save": 10.0,
        "watch_complete": 3.0,
        "share": 7.0
    }
    
    @staticmethod
    async def log_engagement(
        db: AsyncSession,
        user_id: int,
        engagement_data: EngagementLogCreate
    ) -> EngagementLog:
        """
        Log user engagement activity
        """
        log = EngagementLog(
            user_id=user_id,
            recipe_id=engagement_data.recipe_id,
            engagement_type=engagement_data.engagement_type,
            watch_duration=engagement_data.watch_duration,
            watch_percentage=engagement_data.watch_percentage,
            session_id=engagement_data.session_id,
            device_type=engagement_data.device_type
        )
        
        db.add(log)
        await db.commit()
        await db.refresh(log)
        
        # Update recommendation weight asynchronously
        await RecommendationService.update_recommendation_weight(
            db, user_id, engagement_data.recipe_id, engagement_data.engagement_type
        )
        
        return log
    
    @staticmethod
    async def update_recommendation_weight(
        db: AsyncSession,
        user_id: int,
        recipe_id: int,
        engagement_type: EngagementType
    ):
        """
        Update or create recommendation weight for user-recipe pair
        """
        # Get or create weight record
        result = await db.execute(
            select(RecommendationWeight).where(
                and_(
                    RecommendationWeight.user_id == user_id,
                    RecommendationWeight.recipe_id == recipe_id
                )
            )
        )
        weight = result.scalar_one_or_none()
        
        if not weight:
            weight = RecommendationWeight(
                user_id=user_id,
                recipe_id=recipe_id
            )
            db.add(weight)
        
        # Update scores based on engagement type
        if engagement_type == EngagementType.VIEW:
            weight.view_score += RecommendationService.WEIGHT_CONFIG["view"]
        elif engagement_type == EngagementType.LIKE:
            weight.like_score += RecommendationService.WEIGHT_CONFIG["like"]
        elif engagement_type == EngagementType.SAVE:
            weight.save_score += RecommendationService.WEIGHT_CONFIG["save"]
        elif engagement_type == EngagementType.WATCH_COMPLETE:
            weight.watch_time_score += RecommendationService.WEIGHT_CONFIG["watch_complete"]
        elif engagement_type == EngagementType.SHARE:
            weight.view_score += RecommendationService.WEIGHT_CONFIG["share"]
        
        # Calculate total score
        weight.total_score = (
            weight.view_score +
            weight.like_score +
            weight.save_score +
            weight.watch_time_score
        )
        
        await db.commit()
    
    @staticmethod
    async def get_personalized_feed(
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 20,
        exclude_seen: bool = True
    ) -> List[Recipe]:
        """
        Get personalized recipe feed for user
        Uses collaborative filtering based on engagement patterns
        """
        # Get recipes the user has already seen (if excluding)
        seen_recipe_ids = []
        if exclude_seen:
            seen_result = await db.execute(
                select(EngagementLog.recipe_id)
                .where(EngagementLog.user_id == user_id)
                .distinct()
            )
            seen_recipe_ids = [row[0] for row in seen_result.all()]
        
        # Strategy: Recommend recipes that similar users engaged with
        # 1. Find users with similar engagement patterns
        # 2. Get recipes they liked/saved but current user hasn't seen
        
        # For MVP: Simple popularity-based recommendation with personalization
        query = (
            select(Recipe)
            .where(Recipe.is_published == True)
        )
        
        # Exclude seen recipes
        if seen_recipe_ids:
            query = query.where(not_(Recipe.id.in_(seen_recipe_ids)))
        
        # Order by engagement score (popularity)
        query = query.order_by(
            (Recipe.likes_count * 2 + Recipe.saves_count * 3 + Recipe.views_count * 0.1).desc()
        ).offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_similar_recipes(
        db: AsyncSession,
        recipe_id: int,
        limit: int = 10
    ) -> List[Recipe]:
        """
        Get similar recipes based on tags, difficulty, and dietary preferences
        """
        # Get the source recipe
        result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
        source_recipe = result.scalar_one_or_none()
        
        if not source_recipe:
            return []
        
        # Find recipes with similar attributes
        query = (
            select(Recipe)
            .where(
                and_(
                    Recipe.is_published == True,
                    Recipe.id != recipe_id,
                    or_(
                        Recipe.difficulty == source_recipe.difficulty,
                        Recipe.dietary_preference == source_recipe.dietary_preference,
                        Recipe.cooking_time.between(
                            source_recipe.cooking_time - 15,
                            source_recipe.cooking_time + 15
                        )
                    )
                )
            )
            .order_by(Recipe.likes_count.desc())
            .limit(limit)
        )
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_user_preferences(
        db: AsyncSession,
        user_id: int
    ) -> dict:
        """
        Analyze user preferences based on engagement history
        Returns top difficulties, dietary preferences, and cooking times
        """
        # Get user's liked and saved recipes
        liked_result = await db.execute(
            select(Recipe)
            .join(Like, Like.recipe_id == Recipe.id)
            .where(Like.user_id == user_id)
        )
        liked_recipes = liked_result.scalars().all()
        
        saved_result = await db.execute(
            select(Recipe)
            .join(Save, Save.recipe_id == Recipe.id)
            .where(Save.user_id == user_id)
        )
        saved_recipes = saved_result.scalars().all()
        
        all_recipes = liked_recipes + saved_recipes
        
        if not all_recipes:
            return {
                "preferred_difficulty": None,
                "preferred_dietary": None,
                "avg_cooking_time": None
            }
        
        # Analyze preferences
        difficulties = [r.difficulty for r in all_recipes]
        dietary_prefs = [r.dietary_preference for r in all_recipes]
        cooking_times = [r.cooking_time for r in all_recipes]
        
        # Most common difficulty
        preferred_difficulty = max(set(difficulties), key=difficulties.count) if difficulties else None
        
        # Most common dietary preference
        preferred_dietary = max(set(dietary_prefs), key=dietary_prefs.count) if dietary_prefs else None
        
        # Average cooking time
        avg_cooking_time = sum(cooking_times) / len(cooking_times) if cooking_times else None
        
        return {
            "preferred_difficulty": preferred_difficulty,
            "preferred_dietary": preferred_dietary,
            "avg_cooking_time": avg_cooking_time
        }