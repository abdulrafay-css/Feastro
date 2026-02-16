from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from fastapi import HTTPException, status
from app.models.user import User
from app.models.follower import Follower
from app.models.recipe import Recipe
from app.schemas.user import UserUpdate, UserProfile


class UserService:
    """
    User service handling user operations
    """
    
    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
        """
        Get user by ID
        """
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_by_username(db: AsyncSession, username: str) -> Optional[User]:
        """
        Get user by username
        """
        result = await db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def update_user(db: AsyncSession, user: User, user_data: UserUpdate) -> User:
        """
        Update user profile
        """
        # Check if username is being changed and if it's already taken
        if user_data.username and user_data.username != user.username:
            result = await db.execute(
                select(User).where(User.username == user_data.username)
            )
            if result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )
            user.username = user_data.username
        
        # Update other fields
        if user_data.bio is not None:
            user.bio = user_data.bio
        if user_data.avatar_url is not None:
            user.avatar_url = user_data.avatar_url
        
        await db.commit()
        await db.refresh(user)
        
        return user
    
    @staticmethod
    async def get_user_profile(
        db: AsyncSession,
        username: str,
        current_user_id: Optional[int] = None
    ) -> UserProfile:
        """
        Get user profile with stats
        """
        # Get user
        user = await UserService.get_user_by_username(db, username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Count followers
        followers_result = await db.execute(
            select(func.count(Follower.id)).where(Follower.following_id == user.id)
        )
        followers_count = followers_result.scalar() or 0
        
        # Count following
        following_result = await db.execute(
            select(func.count(Follower.id)).where(Follower.follower_id == user.id)
        )
        following_count = following_result.scalar() or 0
        
        # Count recipes
        recipes_result = await db.execute(
            select(func.count(Recipe.id)).where(Recipe.author_id == user.id)
        )
        recipes_count = recipes_result.scalar() or 0
        
        # Check if current user is following this user
        is_following = False
        if current_user_id and current_user_id != user.id:
            follow_result = await db.execute(
                select(Follower).where(
                    and_(
                        Follower.follower_id == current_user_id,
                        Follower.following_id == user.id
                    )
                )
            )
            is_following = follow_result.scalar_one_or_none() is not None
        
        return UserProfile(
            id=user.id,
            username=user.username,
            bio=user.bio,
            avatar_url=user.avatar_url,
            followers_count=followers_count,
            following_count=following_count,
            recipes_count=recipes_count,
            is_following=is_following,
            created_at=user.created_at
        )
    
    @staticmethod
    async def follow_user(db: AsyncSession, follower_id: int, following_id: int) -> Follower:
        """
        Follow a user
        """
        if follower_id == following_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot follow yourself"
            )
        
        # Check if already following
        result = await db.execute(
            select(Follower).where(
                and_(
                    Follower.follower_id == follower_id,
                    Follower.following_id == following_id
                )
            )
        )
        existing_follow = result.scalar_one_or_none()
        
        if existing_follow:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already following this user"
            )
        
        # Create follow relationship
        follow = Follower(follower_id=follower_id, following_id=following_id)
        db.add(follow)
        await db.commit()
        await db.refresh(follow)
        
        return follow
    
    @staticmethod
    async def unfollow_user(db: AsyncSession, follower_id: int, following_id: int) -> bool:
        """
        Unfollow a user
        """
        result = await db.execute(
            select(Follower).where(
                and_(
                    Follower.follower_id == follower_id,
                    Follower.following_id == following_id
                )
            )
        )
        follow = result.scalar_one_or_none()
        
        if not follow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Follow relationship not found"
            )
        
        await db.delete(follow)
        await db.commit()
        
        return True
    
    @staticmethod
    async def get_followers(
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> List[User]:
        """
        Get user's followers
        """
        result = await db.execute(
            select(User)
            .join(Follower, Follower.follower_id == User.id)
            .where(Follower.following_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
    
    @staticmethod
    async def get_following(
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> List[User]:
        """
        Get users that this user follows
        """
        result = await db.execute(
            select(User)
            .join(Follower, Follower.following_id == User.id)
            .where(Follower.follower_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()