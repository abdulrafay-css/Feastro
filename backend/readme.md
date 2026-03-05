# Feastro Backend API

Production-ready FastAPI backend for Feastro - a short-form food content platform.

## 🚀 Features

- **Authentication**: JWT-based authentication with email/password and Google OAuth
- **User Management**: Profiles, followers, following system
- **Recipe System**: CRUD operations with structured ingredients and instructions
- **Video Management**: Video upload and processing pipeline
- **Engagement**: Likes, saves, views tracking
- **Search**: Advanced search with filters (difficulty, dietary preferences, cooking time)
- **Recommendations**: Personalized feed based on user engagement
- **Database**: PostgreSQL with async SQLAlchemy
- **Migrations**: Alembic for database migrations
- **Security**: Password hashing, JWT tokens, rate limiting
- **Scalability**: Async/await, connection pooling, caching ready

## 📋 Requirements

- Python 3.11+
- PostgreSQL 14+
- Redis (optional, for caching)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd feastro/backend
```

### 2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment setup

Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/feastro_db
SECRET_KEY=your-super-secret-key-here
DEBUG=True
```

### 5. Database setup

Create PostgreSQL database:
```bash
createdb feastro_db
```

Run migrations:
```bash
alembic upgrade head
```

### 6. Run the server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: `http://localhost:8000`

Documentation: `http://localhost:8000/docs`

## 🐳 Docker Setup

### Build and run with Docker Compose
```bash
docker-compose up --build
```

This will start:
- FastAPI application (port 8000)
- PostgreSQL database (port 5432)
- Redis cache (port 6379)

## 📁 Project Structure
```
backend/
├── app/
│   ├── core/           # Configuration, security, dependencies
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic
│   ├── database/       # Database configuration
│   └── utils/          # Helper functions
├── alembic/           # Database migrations
├── tests/             # Test files
├── requirements.txt   # Python dependencies
├── Dockerfile        # Docker configuration
└── README.md         # This file
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/google` - Google OAuth login

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users/{username}/profile` - Get user profile
- `POST /api/v1/users/{user_id}/follow` - Follow user
- `DELETE /api/v1/users/{user_id}/follow` - Unfollow user

### Recipes
- `POST /api/v1/recipes` - Create recipe
- `GET /api/v1/recipes` - List recipes
- `GET /api/v1/recipes/{id}` - Get recipe details
- `PUT /api/v1/recipes/{id}` - Update recipe
- `DELETE /api/v1/recipes/{id}` - Delete recipe

### Engagement
- `POST /api/v1/engagement/like` - Like recipe
- `DELETE /api/v1/engagement/like/{recipe_id}` - Unlike recipe
- `POST /api/v1/engagement/save` - Save recipe
- `DELETE /api/v1/engagement/save/{recipe_id}` - Unsave recipe
- `GET /api/v1/engagement/saved` - Get saved recipes

### Search
- `GET /api/v1/search/recipes` - Search recipes
- `GET /api/v1/search/users` - Search users
- `GET /api/v1/search/trending` - Get trending recipes

### Recommendations
- `GET /api/v1/recommendations/feed` - Personalized feed
- `GET /api/v1/recommendations/similar/{recipe_id}` - Similar recipes

## 🧪 Testing

Run tests:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=app tests/
```

## 📝 Database Migrations

Create a new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

Rollback migration:
```bash
alembic downgrade -1
```

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Rate limiting middleware
- CORS configuration
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy

## 🚀 Deployment

### Production checklist:

1. Set `DEBUG=False` in `.env`
2. Use strong `SECRET_KEY`
3. Configure production database
4. Set up Redis for caching
5. Configure CORS origins
6. Set up CDN for static files
7. Enable HTTPS
8. Set up monitoring and logging
9. Configure backup strategy
10. Use environment variables for secrets

### Scaling recommendations:

- Use Gunicorn with multiple workers
- Enable Redis caching
- Use CDN for video content
- Database read replicas
- Horizontal scaling with load balancer
- Queue background tasks with Celery

## 📊 Monitoring

Health check endpoint:
```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "app": "Feastro",
  "version": "1.0.0"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📄 License

MIT License

## 👥 Support

For issues and questions, please open an issue on GitHub.