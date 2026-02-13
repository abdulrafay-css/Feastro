from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base


class Video(Base):
    __tablename__ = "videos"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Video URLs
    video_url = Column(String(500), nullable=False)  # S3/CDN URL
    thumbnail_url = Column(String(500), nullable=True)
    
    # Video Metadata
    duration = Column(Float, nullable=False)  # in seconds
    resolution = Column(String(20), nullable=True)  # e.g., "1080x1920"
    file_size = Column(Integer, nullable=True)  # in bytes
    format = Column(String(10), nullable=True)  # e.g., "mp4"
    
    # Processing Status
    is_processed = Column(Boolean, default=False, nullable=False)
    processing_status = Column(String(50), default="pending", nullable=False)
    
    # Timestamps
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    recipe = relationship("Recipe", back_populates="video", uselist=False)
    
    def __repr__(self):
        return f"<Video(id={self.id}, duration={self.duration}s, status={self.processing_status})>"