from typing import Optional, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from datetime import datetime


class AuthService:
    """
    Authentication service handling login, registration, and token management
    """
    
    @staticmethod
    async def register_user(db: AsyncSession, user_data: RegisterRequest) -> User:
        """
        Register a new user
        """
        # Check if email already exists
        result = await db.execute(select(User).where(User.email == user_data.email))
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username already exists
        result = await db.execute(select(User).where(User.username == user_data.username))
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create new user
        hashed_pwd = hash_password(user_data.password)
        new_user = User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_pwd
        )
        
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        return new_user
    
    @staticmethod
    async def authenticate_user(db: AsyncSession, login_data: LoginRequest) -> User:
        """
        Authenticate user with email and password
        """
        # Find user by email
        result = await db.execute(select(User).where(User.email == login_data.email))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Verify password
        if not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        await db.commit()
        
        return user
    
    @staticmethod
    def create_tokens(user: User) -> TokenResponse:
        """
        Create access and refresh tokens for user
        """
        token_data = {"sub": str(user.id), "email": user.email}
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )
    
    @staticmethod
    async def google_auth(db: AsyncSession, google_token: str) -> User:
        """
        Authenticate or register user with Google OAuth
        TODO: Implement Google OAuth token verification
        """
        # This is a placeholder for Google OAuth implementation
        # You'll need to verify the Google token and extract user info
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not yet implemented"
        )