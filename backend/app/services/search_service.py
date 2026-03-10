from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, func, String, cast
from app.models.recipe import Recipe
from app.models.user import User
from app.schemas.recipe import RecipeSearchFilters, DifficultyLevel, DietaryPreference


class SearchService:
    """
    Search service handling recipe and user search with filters
    """
    
    @staticmethod
    async def search_recipes(
        db: AsyncSession,
        filters: RecipeSearchFilters,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[Recipe], int]:
        """
        Search recipes with filters and pagination
        """
        query = select(Recipe).where(Recipe.is_published == True)
        count_query = select(func.count(Recipe.id)).where(Recipe.is_published == True)
        
        # Text search (title, description, tags)
        if filters.query:
            search_term = f"%{filters.query.lower()}%"
            text_filter = or_(
                func.lower(Recipe.title).like(search_term),
                func.lower(Recipe.description).like(search_term),
                func.lower(cast(Recipe.tags, String)).like(search_term)
            )
            query = query.where(text_filter)
            count_query = count_query.where(text_filter)
        
        # Difficulty filter
        if filters.difficulty:
            query = query.where(Recipe.difficulty == filters.difficulty)
            count_query = count_query.where(Recipe.difficulty == filters.difficulty)
        
        # Dietary preference filter
        if filters.dietary_preference:
            query = query.where(Recipe.dietary_preference == filters.dietary_preference)
            count_query = count_query.where(Recipe.dietary_preference == filters.dietary_preference)
        
        # Max cooking time filter
        if filters.max_cooking_time:
            query = query.where(Recipe.cooking_time <= filters.max_cooking_time)
            count_query = count_query.where(Recipe.cooking_time <= filters.max_cooking_time)
        
        # Tags filter
        if filters.tags:
            for tag in filters.tags:
                tag_filter = func.lower(cast(Recipe.tags, String)).like(f"%{tag.lower()}%")
                query = query.where(tag_filter)
                count_query = count_query.where(tag_filter)
        
        # Ingredient search (search in JSON ingredients)
        if filters.ingredient:
            ingredient_search = f"%{filters.ingredient.lower()}%"
            query = query.where(
                func.lower(Recipe.ingredients.cast(String)).like(ingredient_search)
            )
            count_query = count_query.where(
                func.lower(Recipe.ingredients.cast(String)).like(ingredient_search)
            )
        
        # Get total count
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0
        
        # Apply pagination and ordering
        query = query.offset(skip).limit(limit).order_by(Recipe.created_at.desc())
        
        # Execute query
        result = await db.execute(query)
        recipes = result.scalars().all()
        
        return recipes, total
    
    @staticmethod
    async def search_users(
        db: AsyncSession,
        query: str,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[User], int]:
        """
        Search users by username
        """
        search_term = f"%{query.lower()}%"
        
        # Build query
        search_query = select(User).where(
            and_(
                User.is_active == True,
                or_(
                    func.lower(User.username).like(search_term),
                    func.lower(User.email).like(search_term)
                )
            )
        )
        
        # Count query
        count_query = select(func.count(User.id)).where(
            and_(
                User.is_active == True,
                or_(
                    func.lower(User.username).like(search_term),
                    func.lower(User.email).like(search_term)
                )
            )
        )
        
        # Get total count
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0
        
        # Apply pagination
        search_query = search_query.offset(skip).limit(limit)
        
        # Execute query
        result = await db.execute(search_query)
        users = result.scalars().all()
        
        return users, total
    
    @staticmethod
    async def get_trending_recipes(
        db: AsyncSession,
        limit: int = 20
    ) -> List[Recipe]:
        """
        Get trending recipes based on engagement
        """
        # Calculate trending score: likes + (saves * 2) + (views * 0.1)
        # This is a simple algorithm; can be improved with time-decay
        query = select(Recipe).where(Recipe.is_published == True).order_by(
            (Recipe.likes_count + (Recipe.saves_count * 2) + (Recipe.views_count * 0.1)).desc()
        ).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_popular_tags(
        db: AsyncSession,
        limit: int = 20
    ) -> List[Tuple[str, int]]:
        """
        Get popular tags
        TODO: This needs proper implementation with JSON aggregation
        For now, returns empty list
        """
        # This would require more complex JSON aggregation
        # For MVP, return empty list
        return []