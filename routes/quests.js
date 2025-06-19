import express from 'express';
import Quest from '../models/Quest.js';

const router = express.Router();

// Get all quests (with filters)
router.get('/', async (req, res) => {
	try {
	  const { theme, difficulty, location, radius = 5000, limit = 20 } = req.query;
	  
	  let query = { isActive: true };
	  
	  // Filter by theme
	  if (theme) {
	    query.theme = theme;
	  }
	  
	  // Filter by difficulty
	  if (difficulty) {
	    query.difficulty = difficulty;
	  }
	  
	  // Filter by location (within radius)
	  if (location) {
	    const [lng, lat] = location.split(',').map(Number);
	    query.startLocation = {
	      $near: {
	        $geometry: {
	          type: 'Point',
	          coordinates: [lng, lat]
	        },
	        $maxDistance: parseInt(radius)
	      }
	    };
	  }
	  
	  const quests = await Quest.find(query)
	    .limit(parseInt(limit))
	    .select('-checkpoints.content.answer') // Don't send answers to client
	    .sort({ createdAt: -1 });
	  
	  res.json(quests);
	} catch (error) {
	  res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Generate quest based on parameters (must come before /:id route)
router.post('/generate', async (req, res) => {
	try {
	  const { location, theme, goal, goalType } = req.body;
	  
	  // This is a simplified version - in production you'd integrate with mapping APIs
	  const [lng, lat] = location.split(',').map(Number);
	  
	  // Generate a simple loop route (this would be replaced with actual mapping API)
	  const routeCoordinates = generateSimpleRoute(lng, lat, goal, goalType);
	  
	  // Generate checkpoints based on theme
	  const checkpoints = generateCheckpoints(theme, routeCoordinates);
	  
	  const quest = new Quest({
	    title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Adventure`,
	    theme,
	    description: `A ${theme} themed walking adventure`,
	    estimatedTime: goalType === 'time' ? goal : estimateTime(goal),
	    estimatedDistance: goalType === 'distance' ? goal : estimateDistance(goal),
	    startLocation: {
	      type: 'Point',
	      coordinates: [lng, lat]
	    },
	    route: {
	      type: 'LineString',
	      coordinates: routeCoordinates
	    },
	    checkpoints
	  });
	  
	  await quest.save();
	  res.status(201).json(quest);
	} catch (error) {
	  res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Get quest by ID (must come after /generate route)
router.get('/:id', async (req, res) => {
	try {
	  const quest = await Quest.findById(req.params.id)
	    .select('-checkpoints.content.answer'); // Don't send answers to client
	  
	  if (!quest) {
	    return res.status(404).json({ message: 'Quest not found' });
	  }
	  
	  res.json(quest);
	} catch (error) {
	  res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Helper functions (simplified - replace with actual mapping API integration)
function generateSimpleRoute(lng, lat, goal, goalType) {
	// Generate a simple square route around the starting point
	const radius = goalType === 'distance' ? goal / 4000 : 0.001; // Rough conversion
	
	return [
	  [lng, lat],
	  [lng + radius, lat],
	  [lng + radius, lat + radius],
	  [lng, lat + radius],
	  [lng - radius, lat + radius],
	  [lng - radius, lat],
	  [lng, lat]
	];
}

function generateCheckpoints(theme, routeCoordinates) {
	const checkpoints = [];
	const themes = {
	  pirate: [
	    { type: 'story', title: 'The Hidden Treasure', description: 'Legend says pirates buried treasure here...' },
	    { type: 'photo', title: 'Shipwreck Spot', description: 'Take a photo of something that looks like a ship' },
	    { type: 'riddle', title: 'Pirate\'s Riddle', description: 'What has keys, but no locks; space, but no room; and you can enter, but not go in?' }
	  ],
	  romantic: [
	    { type: 'story', title: 'Love Story', description: 'This spot has witnessed many romantic moments...' },
	    { type: 'photo', title: 'Heart Shape', description: 'Find and photograph something heart-shaped' },
	    { type: 'collection', title: 'Love Tokens', description: 'Collect 3 red flowers or leaves' }
	  ],
	  nature: [
	    { type: 'story', title: 'Nature\'s Secrets', description: 'This area is home to many wildlife species...' },
	    { type: 'photo', title: 'Wildlife Spotting', description: 'Take a photo of any animal or bird you see' },
	    { type: 'trivia', title: 'Nature Quiz', description: 'What type of tree is most common in this area?' }
	  ],
	  detective: [
	    { type: 'story', title: 'The Mystery', description: 'A mysterious event happened here recently...' },
	    { type: 'photo', title: 'Evidence Collection', description: 'Photograph something that could be evidence' },
	    { type: 'riddle', title: 'Detective\'s Puzzle', description: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?' }
	  ]
	};
	
	const themeCheckpoints = themes[theme] || themes.nature;
	
	themeCheckpoints.forEach((checkpoint, index) => {
	  const routePoint = routeCoordinates[Math.floor((index + 1) * routeCoordinates.length / (themeCheckpoints.length + 1))];
	  
	  checkpoints.push({
	    order: index + 1,
	    location: {
	      type: 'Point',
	      coordinates: routePoint
	    },
	    ...checkpoint,
	    content: {
	      storyPrompt: checkpoint.description,
	      photoTask: checkpoint.type === 'photo' ? checkpoint.description : '',
	      question: checkpoint.type === 'trivia' ? checkpoint.description : '',
	      answer: checkpoint.type === 'riddle' ? 'echo' : '',
	      hints: ['Look around carefully', 'Think creatively'],
	      reward: {
	        xp: 10,
	        badge: `${theme}_${index + 1}`
	      }
	    }
	  });
	});
	
	return checkpoints;
}

function estimateTime(distance) {
	// Rough estimate: 5 km/h walking speed
	return Math.round(distance / 83); // minutes
}

function estimateDistance(time) {
	// Rough estimate: 5 km/h walking speed
	return Math.round(time * 83); // meters
}

export default router; 