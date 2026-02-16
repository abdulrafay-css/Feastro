from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database.session import get_db
from app.core.dependencies import get_current_user, get_current_active_user
from app.models.user import User
from app.schemas.user import (
    UserResponse,
    UserUpdate,
    UserProfile,
    UserPublic,
    FollowerResponse
)
from app.services.user_service import UserService

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user information
    """
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user profile
    """
    updated_user = await UserService.update_user(db, current_user, user_data)
    return updated_user


@router.get("/{username}/profile", response_model=UserProfile)
async def get_user_profile(
    username: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get user profile by username
    """
    profile = await UserService.get_user_profile(
        db,
        username,
        current_user.id if current_user else None
    )
    return profile


@router.post("/{user_id}/follow", response_model=FollowerResponse)
async def follow_user(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Follow a user
    """
    follow = await UserService.follow_user(db, current_user.id, user_id)
    return follow


@router.delete("/{user_id}/follow")
async def unfollow_user(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Unfollow a user
    """
    await UserService.unfollow_user(db, current_user.id, user_id)
    return {"message": "Successfully unfollowed user"}


@router.get("/{user_id}/followers", response_model=List[UserPublic])
async def get_followers(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user's followers
    """
    followers = await UserService.get_followers(db, user_id, skip, limit)
    return followers


@router.get("/{user_id}/following", response_model=List[UserPublic])
async def get_following(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get users that this user follows
    """
    following = await UserService.get_following(db, user_id, skip, limit)
    return following