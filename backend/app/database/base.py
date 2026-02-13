from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Import all models here for Alembic to detect them
from app.models.user import User
from app.models.recipe import Recipe
from app.models.video import Video
from app.models.engagement import Like, Save
from app.models.follower import Follower
from app.models.recommendation import EngagementLog, RecommendationWeight