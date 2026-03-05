from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class EngagementType(str, Enum):
    VIEW = "view"
    LIKE = "like"
    SAVE = "save"
    SHARE = "share"
    WATCH_COMPLETE = "watch_complete"


class LikeCreate(BaseModel):
    recipe_id: int


class LikeResponse(BaseModel):
    id: int
    user_id: int
    recipe_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class SaveCreate(BaseModel):
    recipe_id: int


class SaveResponse(BaseModel):
    id: int
    user_id: int
    recipe_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class EngagementStats(BaseModel):
    likes_count: int
    saves_count: int
    views_count: int
    is_liked: bool = False
    is_saved: bool = False


class EngagementLogCreate(BaseModel):
    recipe_id: int
    engagement_type: EngagementType
    watch_duration: Optional[float] = None
    watch_percentage: Optional[float] = None
    session_id: Optional[str] = None
    device_type: Optional[str] = None


class EngagementLogResponse(BaseModel):
    id: int
    user_id: int
    recipe_id: int
    engagement_type: EngagementType
    watch_duration: Optional[float]
    watch_percentage: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True