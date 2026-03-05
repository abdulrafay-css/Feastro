from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = None


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    bio: Optional[str]
    avatar_url: Optional[str]
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    id: int
    username: str
    bio: Optional[str]
    avatar_url: Optional[str]
    followers_count: int = 0
    following_count: int = 0
    recipes_count: int = 0
    is_following: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserPublic(BaseModel):
    id: int
    username: str
    avatar_url: Optional[str]
    
    class Config:
        from_attributes = True


class FollowerResponse(BaseModel):
    follower_id: int
    following_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True