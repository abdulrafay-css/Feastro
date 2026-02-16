from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    GoogleAuthRequest,
    RefreshTokenRequest
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.core.security import decode_token, verify_token_type

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user
    """
    # Register user
    user = await AuthService.register_user(db, user_data)
    
    # Create tokens
    tokens = AuthService.create_tokens(user)
    
    return tokens


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Login user with email and password
    """
    # Authenticate user
    user = await AuthService.authenticate_user(db, login_data)
    
    # Create tokens
    tokens = AuthService.create_tokens(user)
    
    return tokens


@router.post("/google", response_model=TokenResponse)
async def google_auth(
    auth_data: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate with Google OAuth
    """
    user = await AuthService.google_auth(db, auth_data.token)
    tokens = AuthService.create_tokens(user)
    
    return tokens


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh access token using refresh token
    """
    # Decode refresh token
    payload = decode_token(refresh_data.refresh_token)
    
    # Verify it's a refresh token
    if not verify_token_type(payload, "refresh"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    # Get user from database
    from app.services.user_service import UserService
    user_id = int(payload.get("sub"))
    user = await UserService.get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Create new tokens
    tokens = AuthService.create_tokens(user)
    
    return tokens


@router.post("/logout")
async def logout():
    """
    Logout user (client-side token removal)
    """
    # In a stateless JWT system, logout is handled client-side
    # For a more secure implementation, you could:
    # 1. Add tokens to a blacklist in Redis
    # 2. Use shorter token expiration times
    # 3. Implement token revocation
    
    return {"message": "Successfully logged out"}