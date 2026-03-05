from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base
import enum


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Authentication
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile
    bio = Column(String(500), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Role & Status
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    
    # OAuth
    google_id = Column(String(255), unique=True, nullable=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    recipes = relationship("Recipe", back_populates="author", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    saves = relationship("Save", back_populates="user", cascade="all, delete-orphan")
    
    # Followers (users who follow this user)
    followers = relationship(
        "Follower",
        foreign_keys="Follower.following_id",
        back_populates="following",
        cascade="all, delete-orphan"
    )
    
    # Following (users this user follows)
    following = relationship(
        "Follower",
        foreign_keys="Follower.follower_id",
        back_populates="follower",
        cascade="all, delete-orphan"
    )
    
    engagement_logs = relationship("EngagementLog", back_populates="user", cascade="all, delete-orphan")
    recommendation_weights = relationship("RecommendationWeight", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"