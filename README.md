# 🌐 Live Demo

👉 Frontend: https://news-mern-app-frontend.vercel.app/ <br/>

👉 Backend API: https://news-mern-app-backend.vercel.app/api/health

---

## 🔐 Admin Demo Access

📧 Email: admin@example.com  
🔑 Password: admin123  

⚠️ **Note:** This is a demo admin account for testing purposes only. Please do not change the credentials or delete data.

---



## News Website - MERN Stack

NewsHub: A Full-Stack MERN News Platform
A modern, feature-rich news application built with MongoDB, Express, React, and Node.js. It provides a seamless experience for both readers and content managers

## Features
-User Experience: Browse news by category, search articles, and engage with content via likes, favorites, and threaded comments.

-Admin Dashboard: A private portal to manage the full lifecycle of articles, including creating, editing, deleting, and setting "Featured" or "Draft" statuses.

-Smart Content: Features real-time trending news, related article suggestions, and image upload capabilities.

-Secure Auth: Implements JWT-based authentication with role-based access control (Admin vs. User).

### User Side
- Browse all published news articles
- View news by category
- Search news
- View featured and trending news
- Like/Unlike news articles
- Add news to favorites
- Comment on news articles
- Reply to comments
- Like comments

### Admin Side
- Dashboard with statistics
- Create, Read, Update, Delete (CRUD) news articles
- Upload images
- Set featured news
- Publish/Draft/Archive articles
- Filter and search news

## Project Structure

```
news-mern-app/
├── backend/                 # Express.js API server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, upload, validation middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── uploads/            # Uploaded images
│   ├── .env                # Environment variables
│   ├── package.json
│   └── server.js           # Entry point
│
└── frontend/               # React application
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── context/        # Auth context
    │   ├── pages/          # Page components
    │   │   └── admin/      # Admin panel pages
    │   ├── services/       # API services
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### News (User)
- `GET /api/news` - Get all published news
- `GET /api/news/:slug` - Get news by slug
- `GET /api/news/featured` - Get featured news
- `GET /api/news/trending` - Get trending news
- `GET /api/news/category/:category` - Get news by category
- `GET /api/news/categories` - Get all categories
- `POST /api/news/:id/like` - Like/Unlike news
- `POST /api/news/:id/favorite` - Add/Remove from favorites
- `GET /api/news/user/favorites` - Get user favorites
- `GET /api/news/:id/related` - Get related news

### Comments
- `GET /api/news/:newsId/comments` - Get comments for news
- `POST /api/news/:newsId/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like/Unlike comment

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/news` - Get all news (including drafts)
- `GET /api/admin/news/:id` - Get news by ID
- `POST /api/admin/news` - Create news
- `PUT /api/admin/news/:id` - Update news
- `DELETE /api/admin/news/:id` - Delete news
- `PATCH /api/admin/news/:id/featured` - Toggle featured
- `POST /api/admin/upload` - Upload image

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
# Create .env file with your MongoDB URI
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/news_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

## Creating First Admin User

1. Register a regular user via the app
2. Connect to MongoDB and update the user's role:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Tailwind CSS
- React Icons
- React Toastify
- date-fns

