from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base


class Like(Base):
    __tablename__ = "likes"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="likes")
    recipe = relationship("Recipe", back_populates="likes")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint("user_id", "recipe_id", name="unique_user_recipe_like"),
    )
    
    def __repr__(self):
        return f"<Like(user_id={self.user_id}, recipe_id={self.recipe_id})>"


class Save(Base):
    __tablename__ = "saves"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="saves")
    recipe = relationship("Recipe", back_populates="saves")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint("user_id", "recipe_id", name="unique_user_recipe_save"),
    )
    
    def __repr__(self):
        return f"<Save(user_id={self.user_id}, recipe_id={self.recipe_id})>"