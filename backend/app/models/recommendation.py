from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base
import enum


class EngagementType(str, enum.Enum):
    VIEW = "view"
    LIKE = "like"
    SAVE = "save"
    SHARE = "share"
    WATCH_COMPLETE = "watch_complete"


class EngagementLog(Base):
    """
    Logs all user engagement for recommendation engine
    """
    __tablename__ = "engagement_logs"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Engagement Details
    engagement_type = Column(SQLEnum(EngagementType), nullable=False, index=True)
    watch_duration = Column(Float, nullable=True)  # in seconds
    watch_percentage = Column(Float, nullable=True)  # 0.0 to 1.0
    
    # Metadata
    session_id = Column(String(100), nullable=True)
    device_type = Column(String(50), nullable=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="engagement_logs")
    recipe = relationship("Recipe", back_populates="engagement_logs")
    
    def __repr__(self):
        return f"<EngagementLog(user_id={self.user_id}, recipe_id={self.recipe_id}, type={self.engagement_type})>"


class RecommendationWeight(Base):
    """
    Stores recommendation weights for each user-recipe pair
    Used by the recommendation engine to generate personalized feeds
    """
    __tablename__ = "recommendation_weights"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Weight Scores
    view_score = Column(Float, default=0.0, nullable=False)
    like_score = Column(Float, default=0.0, nullable=False)
    save_score = Column(Float, default=0.0, nullable=False)
    watch_time_score = Column(Float, default=0.0, nullable=False)
    
    # Combined Score
    total_score = Column(Float, default=0.0, nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="recommendation_weights")
    
    def __repr__(self):
        return f"<RecommendationWeight(user_id={self.user_id}, recipe_id={self.recipe_id}, score={self.total_score})>"