from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class RecommendationWeightResponse(BaseModel):
    id: int
    user_id: int
    recipe_id: int
    view_score: float
    like_score: float
    save_score: float
    watch_time_score: float
    total_score: float
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class RecommendationRequest(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=10, ge=1, le=100)
    exclude_seen: bool = True


class RecommendationResponse(BaseModel):
    recipe_id: int
    title: str
    thumbnail_url: Optional[str]
    video_url: str
    author_username: str
    cooking_time: int
    likes_count: int
    saves_count: int
    recommendation_score: float
    
    class Config:
        from_attributes = True


class RecommendationFeed(BaseModel):
    recipes: List[RecommendationResponse]
    page: int
    page_size: int
    total: int
    has_more: bool