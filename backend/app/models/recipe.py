from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base
import enum


class DifficultyLevel(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class DietaryPreference(str, enum.Enum):
    NONE = "none"
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    GLUTEN_FREE = "gluten_free"
    KETO = "keto"
    PALEO = "paleo"


class Recipe(Base):
    __tablename__ = "recipes"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    video_id = Column(Integer, ForeignKey("videos.id", ondelete="CASCADE"), nullable=True, index=True)
    
    # Basic Info
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Recipe Details
    ingredients = Column(JSON, nullable=False)  # List of structured ingredients
    instructions = Column(JSON, nullable=False)  # List of step-by-step instructions
    
    # Metadata
    cooking_time = Column(Integer, nullable=False)  # in minutes
    servings = Column(Integer, default=1, nullable=False)
    difficulty = Column(SQLEnum(DifficultyLevel), default=DifficultyLevel.MEDIUM, nullable=False)
    dietary_preference = Column(SQLEnum(DietaryPreference), default=DietaryPreference.NONE, nullable=False)
    
    # Nutritional Info (placeholder for future)
    calories = Column(Integer, nullable=True)
    protein = Column(Float, nullable=True)
    carbs = Column(Float, nullable=True)
    fat = Column(Float, nullable=True)
    
    # Engagement Counters (denormalized for performance)
    likes_count = Column(Integer, default=0, nullable=False)
    saves_count = Column(Integer, default=0, nullable=False)
    views_count = Column(Integer, default=0, nullable=False)
    
    # Tags for search
    tags = Column(JSON, nullable=True)  # List of tags
    
    # Status
    is_published = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    # Relationships
    author = relationship("User", back_populates="recipes")
    video = relationship("Video", back_populates="recipe", uselist=False)
    likes = relationship("Like", back_populates="recipe", cascade="all, delete-orphan")
    saves = relationship("Save", back_populates="recipe", cascade="all, delete-orphan")
    engagement_logs = relationship("EngagementLog", back_populates="recipe", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Recipe(id={self.id}, title={self.title}, author_id={self.author_id})>"