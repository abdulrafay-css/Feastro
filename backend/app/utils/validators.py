from typing import Optional
import re
from fastapi import HTTPException, status


class ValidationError(HTTPException):
    """
    Custom validation error
    """
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail
        )


def validate_password_strength(password: str) -> bool:
    """
    Validate password strength
    Returns True if valid, raises ValidationError if invalid
    """
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long")
    
    if len(password) > 100:
        raise ValidationError("Password must not exceed 100 characters")
    
    if not re.search(r'[A-Z]', password):
        raise ValidationError("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        raise ValidationError("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        raise ValidationError("Password must contain at least one digit")
    
    return True


def validate_username(username: str) -> bool:
    """
    Validate username format
    """
    if len(username) < 3:
        raise ValidationError("Username must be at least 3 characters long")
    
    if len(username) > 50:
        raise ValidationError("Username must not exceed 50 characters")
    
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        raise ValidationError("Username can only contain letters, numbers, and underscores")
    
    return True


def validate_email(email: str) -> bool:
    """
    Validate email format
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(pattern, email):
        raise ValidationError("Invalid email format")
    
    return True


def validate_cooking_time(cooking_time: int) -> bool:
    """
    Validate cooking time
    """
    if cooking_time < 1:
        raise ValidationError("Cooking time must be at least 1 minute")
    
    if cooking_time > 1440:  # 24 hours
        raise ValidationError("Cooking time cannot exceed 24 hours")
    
    return True


def validate_servings(servings: int) -> bool:
    """
    Validate servings count
    """
    if servings < 1:
        raise ValidationError("Servings must be at least 1")
    
    if servings > 100:
        raise ValidationError("Servings cannot exceed 100")
    
    return True


def validate_url(url: str) -> bool:
    """
    Validate URL format
    """
    pattern = r'^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$'
    
    if not re.match(pattern, url):
        raise ValidationError("Invalid URL format")
    
    return True


def validate_video_duration(duration: float) -> bool:
    """
    Validate video duration (max 5 minutes for short-form content)
    """
    if duration < 1:
        raise ValidationError("Video duration must be at least 1 second")
    
    if duration > 300:  # 5 minutes
        raise ValidationError("Video duration cannot exceed 5 minutes")
    
    return True


def validate_bio(bio: Optional[str]) -> bool:
    """
    Validate user bio
    """
    if bio and len(bio) > 500:
        raise ValidationError("Bio cannot exceed 500 characters")
    
    return True