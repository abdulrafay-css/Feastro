# 🍽️ Feastro Backend API

MongoDB + Node.js + Express backend for Feastro recipe sharing platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- AWS Account (for S3)

### Installation

1. **Clone and install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your values
```

3. **Start MongoDB** (if using local)
```bash
mongod
```

4. **Run the server**
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:3000`

## 📁 Project Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation, upload
│   ├── utils/           # Helper functions
│   └── app.js           # Express app
├── .env                 # Environment variables
├── server.js            # Entry point
└── package.json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `PUT /api/auth/onboarding` - Save preferences

### Users
- `GET /api/users/:username` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:username/recipes` - Get user's recipes
- `GET /api/users/me/liked-recipes` - Get liked recipes
- `GET /api/users/me/saved-recipes` - Get saved recipes
- `GET /api/users/me/collections` - Get collections
- `DELETE /api/users/account` - Delete account

### Recipes
- `POST /api/recipes` - Create recipe (Creator only)
- `GET /api/recipes` - Get all recipes (with filters)
- `GET /api/recipes/trending` - Get trending recipes
- `GET /api/recipes/:id` - Get single recipe
- `PUT /api/recipes/:id` - Update recipe (Owner only)
- `DELETE /api/recipes/:id` - Delete recipe (Owner only)
- `POST /api/recipes/:id/like` - Like recipe
- `DELETE /api/recipes/:id/like` - Unlike recipe
- `POST /api/recipes/:id/save` - Save recipe
- `DELETE /api/recipes/:id/save` - Unsave recipe

## 🔐 Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## 📦 Technologies

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **File Storage:** AWS S3
- **Validation:** Express-validator
- **Security:** Helmet, bcryptjs

## 🌍 Deployment

See deployment guides in `/docs` folder:
- MongoDB Atlas setup
- AWS S3 configuration
- AWS Elastic Beanstalk deployment

## 👥 Team

Built by TecXora - Abdul Rafay Siddique & Team

## 📄 License

MIT
```

---

## **✅ BATCH 7 COMPLETE! 🎉**

---

## **🎊 ENTIRE BACKEND IS NOW COMPLETE!**

**All 26 files generated:**
- ✅ Configuration (database, JWT, AWS)
- ✅ Models with validation (User, Recipe, Like, SavedRecipe)
- ✅ Middleware (auth, validation, upload, error handling)
- ✅ Controllers (auth, users, recipes)
- ✅ Routes with validation
- ✅ Utilities (ApiError, ApiResponse, validators)

---

## **📋 COMPLETE FILE CHECKLIST:**
```
backend/
├── ✅ package.json
├── ✅ .env.example
├── ✅ .gitignore
├── ✅ server.js
├── ✅ README.md
└── src/
    ├── ✅ app.js
    ├── config/
    │   ├── ✅ database.js
    │   ├── ✅ jwt.js
    │   └── ✅ aws.js
    ├── models/
    │   ├── ✅ User.js
    │   ├── ✅ Recipe.js
    │   ├── ✅ Like.js
    │   └── ✅ SavedRecipe.js
    ├── middleware/
    │   ├── ✅ auth.js
    │   ├── ✅ validate.js
    │   ├── ✅ upload.js
    │   └── ✅ errorHandler.js
    ├── controllers/
    │   ├── ✅ authController.js
    │   ├── ✅ userController.js
    │   └── ✅ recipeController.js
    ├── routes/
    │   ├── ✅ auth.js
    │   ├── ✅ users.js
    │   └── ✅ recipes.js
    └── utils/
        ├── ✅ ApiError.js
        ├── ✅ ApiResponse.js
        └── ✅ validators.js