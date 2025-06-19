# QuestWalk Backend API

A Node.js/Express backend API for QuestWalk - a gamified walking adventure generator. This API provides endpoints for user authentication, quest generation, walk tracking, and progress management.

## 🚀 Features

### Core API Features
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Quest Generation**: Location-based quest creation with themed checkpoints
- **Walk Tracking**: Real-time walk progress and checkpoint completion
- **Gamification**: XP system, badges, and user statistics
- **Geospatial Queries**: MongoDB geospatial indexing for location-based features
- **RESTful API**: Clean, documented endpoints following REST conventions

### Data Models
- **Users**: Profiles, stats, badges, completed quests
- **Quests**: Themed adventures with checkpoints and routes
- **Walks**: Active and completed walking sessions

## 🛠️ Technology Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/TysonPWilliams/quest-walk-backend.git
   cd quest-walk-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/questwalk
   JWT_SECRET=your-super-secret-jwt-key
   MAPBOX_ACCESS_TOKEN=your-mapbox-token
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Test the API**
   - API Info: http://localhost:3000
   - Health Check: http://localhost:3000/api/health

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### Quest Endpoints

#### Get All Quests
```http
GET /api/quests?theme=pirate&difficulty=easy&location=-73.935242,40.730610&radius=5000&limit=20
```

#### Get Quest by ID
```http
GET /api/quests/:id
```

#### Generate New Quest
```http
POST /api/quests/generate
Content-Type: application/json

{
  "location": "-73.935242,40.730610",
  "theme": "pirate",
  "goal": 20,
  "goalType": "time"
}
```

### Walk Endpoints

#### Start a Walk
```http
POST /api/walks/start
Content-Type: application/json

{
  "questId": "quest-id-here",
  "startLocation": "-73.935242,40.730610"
}
```

#### Update Walk Progress
```http
PUT /api/walks/:walkId/progress
Content-Type: application/json

{
  "currentLocation": "-73.935242,40.730610",
  "checkpointId": "checkpoint-id",
  "action": "complete",
  "data": {
    "photos": ["photo-url"],
    "answers": ["answer"],
    "score": 10
  }
}
```

#### Get Walk Details
```http
GET /api/walks/:walkId
```

#### Complete Walk
```http
PUT /api/walks/:walkId/complete
Content-Type: application/json

{
  "rating": 5,
  "review": "Great adventure!",
  "photos": ["photo1.jpg", "photo2.jpg"]
}
```

## 🔧 Development

### Project Structure
```
quest-walk-backend/
├── models/          # MongoDB schemas
│   ├── User.js     # User model
│   ├── Quest.js    # Quest model
│   └── Walk.js     # Walk model
├── routes/          # API endpoints
│   ├── auth.js     # Authentication routes
│   ├── quests.js   # Quest routes
│   └── walks.js    # Walk routes
├── db.js           # Database connection
├── index.js        # Server entry point
└── package.json    # Dependencies
```

### Adding New Features

1. **Create/Update Models**: Add new schemas in `/models/`
2. **Add Routes**: Create new route files in `/routes/`
3. **Update Server**: Register new routes in `index.js`
4. **Test Endpoints**: Use Postman or curl to test

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/questwalk` |
| `JWT_SECRET` | JWT signing secret | Required |
| `MAPBOX_ACCESS_TOKEN` | Mapbox API token | Optional |

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. **Connect your repository** to Railway or Render
2. **Set environment variables** in the deployment platform
3. **Deploy** - the platform will automatically build and deploy

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-production-jwt-secret
MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

## 📊 API Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## 🔒 Security

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Request body validation
- **Error Handling**: Secure error responses

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🎯 Next Steps

### Frontend Development
Create a separate React frontend project that consumes this API:

```bash
npx create-react-app quest-walk-frontend
cd quest-walk-frontend
npm install axios react-router-dom
```

### API Integration
Use the endpoints documented above to build your React frontend.

### Testing
- Use Postman or Insomnia to test API endpoints
- Consider adding automated tests with Jest
- Test with different user scenarios

---

**QuestWalk Backend API** - Powering walking adventures! 🚶‍♂️✨