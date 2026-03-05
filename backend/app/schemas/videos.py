from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class VideoBase(BaseModel):
    video_url: str
    thumbnail_url: Optional[str] = None
    duration: float = Field(..., gt=0)
    resolution: Optional[str] = None
    file_size: Optional[int] = None
    format: Optional[str] = "mp4"


class VideoCreate(VideoBase):
    pass


class VideoUpdate(BaseModel):
    thumbnail_url: Optional[str] = None
    is_processed: Optional[bool] = None
    processing_status: Optional[str] = None


class VideoResponse(BaseModel):
    id: int
    video_url: str
    thumbnail_url: Optional[str]
    duration: float
    resolution: Optional[str]
    file_size: Optional[int]
    format: Optional[str]
    is_processed: bool
    processing_status: str
    uploaded_at: datetime
    processed_at: Optional[datetime]
    
    class Config:
        from_attributes = True