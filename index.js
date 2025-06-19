import 'dotenv/config'
import express from "express";
import cors from 'cors';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import questRoutes from './routes/quests.js';
import walkRoutes from './routes/walks.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/walks', walkRoutes);

// API info route
app.get('/', (req, res) => {
	res.json({ 
	  message: 'QuestWalk API is running!',
	  version: '1.0.0',
	  endpoints: {
	    auth: '/api/auth',
	    quests: '/api/quests',
	    walks: '/api/walks'
	  },
	  documentation: 'https://github.com/TysonPWilliams/quest-walk-backend#api-endpoints'
	});
});

// API health check
app.get('/api/health', (req, res) => {
	res.json({ 
	  status: 'OK',
	  timestamp: new Date().toISOString(),
	  uptime: process.uptime()
	});
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
	res.status(404).json({ 
	  message: 'API endpoint not found',
	  availableEndpoints: {
	    auth: '/api/auth',
	    quests: '/api/quests',
	    walks: '/api/walks',
	    health: '/api/health'
	  }
	});
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ 
	  message: 'Internal server error',
	  error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
	});
});

// Start server
app.listen(PORT, () => {
	console.log(`QuestWalk API running on port ${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
	console.log(`API Documentation: http://localhost:${PORT}`);
});