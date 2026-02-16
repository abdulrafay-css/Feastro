from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class DietaryPreference(str, Enum):
    NONE = "none"
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    GLUTEN_FREE = "gluten_free"
    KETO = "keto"
    PALEO = "paleo"


class IngredientItem(BaseModel):
    name: str
    quantity: str
    unit: Optional[str] = None


class InstructionStep(BaseModel):
    step_number: int
    instruction: str
    duration: Optional[int] = None  # in minutes


class RecipeBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    ingredients: List[IngredientItem]
    instructions: List[InstructionStep]
    cooking_time: int = Field(..., gt=0)
    servings: int = Field(default=1, gt=0)
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    dietary_preference: DietaryPreference = DietaryPreference.NONE
    tags: Optional[List[str]] = None


class RecipeCreate(RecipeBase):
    video_url: Optional[str] = None
    
    @validator('ingredients')
    def validate_ingredients(cls, v):
        if len(v) < 1:
            raise ValueError('At least one ingredient is required')
        return v
    
    @validator('instructions')
    def validate_instructions(cls, v):
        if len(v) < 1:
            raise ValueError('At least one instruction step is required')
        # Validate step numbers are sequential
        for i, step in enumerate(v, start=1):
            if step.step_number != i:
                raise ValueError(f'Step numbers must be sequential. Expected {i}, got {step.step_number}')
        return v


class RecipeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = None
    ingredients: Optional[List[IngredientItem]] = None
    instructions: Optional[List[InstructionStep]] = None
    cooking_time: Optional[int] = Field(None, gt=0)
    servings: Optional[int] = Field(None, gt=0)
    difficulty: Optional[DifficultyLevel] = None
    dietary_preference: Optional[DietaryPreference] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None


class RecipeResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    author_id: int
    cooking_time: int
    servings: int
    difficulty: DifficultyLevel
    dietary_preference: DietaryPreference
    likes_count: int
    saves_count: int
    views_count: int
    is_published: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class RecipeDetail(BaseModel):
    id: int
    title: str
    description: Optional[str]
    ingredients: List[Dict[str, Any]]
    instructions: List[Dict[str, Any]]
    cooking_time: int
    servings: int
    difficulty: DifficultyLevel
    dietary_preference: DietaryPreference
    calories: Optional[int]
    protein: Optional[float]
    carbs: Optional[float]
    fat: Optional[float]
    tags: Optional[List[str]]
    author_id: int
    author_username: str
    author_avatar: Optional[str]
    video_url: Optional[str]
    thumbnail_url: Optional[str]
    likes_count: int
    saves_count: int
    views_count: int
    is_liked: bool = False
    is_saved: bool = False
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class RecipeList(BaseModel):
    id: int
    title: str
    thumbnail_url: Optional[str]
    cooking_time: int
    difficulty: DifficultyLevel
    likes_count: int
    saves_count: int
    author_username: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class RecipeSearchFilters(BaseModel):
    query: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    dietary_preference: Optional[DietaryPreference] = None
    max_cooking_time: Optional[int] = None
    tags: Optional[List[str]] = None
    ingredient: Optional[str] = None