"""Main application entry point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.database.session import init_db, close_db

# Import routes (we'll handle errors if they don't exist)
try:
    from app.routes import auth, user, recipes, engagement, search, recomendation, videos
    ROUTES_AVAILABLE = True
except ImportError as e:
    ROUTES_AVAILABLE = False
    print(f"Warning: Some route modules not found: {e}. App will start with limited functionality.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    print("Starting up...")
    await init_db()
    print("Database initialized!")
    yield
    # Shutdown
    print("Shutting down...")
    await close_db()
    print("Database connections closed!")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

# Configure CORS
origins = settings.ALLOWED_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health",
    }


# Include routers if available
if ROUTES_AVAILABLE:
    try:
        app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
    except:
        pass
    
    try:
        app.include_router(user.router, prefix="/api/v1/users", tags=["Users"])
    except:
        pass
    
    try:
        app.include_router(recipes.router, prefix="/api/v1/recipes", tags=["Recipes"])
    except:
        pass
    
    try:
        app.include_router(engagement.router, prefix="/api/v1/engagement", tags=["Engagement"])
    except:
        pass
    
    try:
        app.include_router(search.router, prefix="/api/v1/search", tags=["Search"])
    except:
        pass
    
    try:
        app.include_router(recomendation.router, prefix="/api/v1/recommendations", tags=["Recommendations"])
    except:
        pass
    
    try:
        app.include_router(videos.router, prefix="/api/v1/videos", tags=["Videos"])
    except:
        pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )


