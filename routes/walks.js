import express from 'express';
import Walk from '../models/Walk.js';
import Quest from '../models/Quest.js';
import User from '../models/User.js';

const router = express.Router();

// Start a new walk
router.post('/start', async (req, res) => {
	try {
	  const { questId, startLocation } = req.body;
	  const userId = req.user?.id || 'anonymous'; // For MVP, allow anonymous users
	  
	  const quest = await Quest.findById(questId);
	  if (!quest) {
	    return res.status(404).json({ message: 'Quest not found' });
	  }
	  
	  const walk = new Walk({
	    user: userId,
	    quest: questId,
	    startTime: new Date(),
	    route: {
	      type: 'LineString',
	      coordinates: [startLocation.split(',').map(Number)]
	    },
	    checkpoints: quest.checkpoints.map(cp => ({
	      checkpointId: cp._id,
	      order: cp.order,
	      completed: false
	    })),
	    progress: {
	      currentCheckpoint: 0,
	      completedCheckpoints: 0,
	      totalCheckpoints: quest.checkpoints.length
	    }
	  });
	  
	  await walk.save();
	  res.status(201).json(walk);
	} catch (error) {
	  res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Update walk progress
router.put('/:walkId/progress', async (req, res) => {
	try {
	  const { currentLocation, checkpointId, action, data } = req.body;
	  
	  const walk = await Walk.findById(req.params.walkId);
	  if (!walk) {
	    return res.status(404).json({ message: 'Walk not found' });
	  }
	  
	  // Update route with current location
	  walk.route.coordinates.push(currentLocation.split(',').map(Number));
	  
	  // Handle checkpoint completion
	  if (checkpointId && action === 'complete') {
	    const checkpoint = walk.checkpoints.find(cp => cp.checkpointId.toString() === checkpointId);
	    if (checkpoint && !checkpoint.completed) {
	      checkpoint.completed = true;
	      checkpoint.completedAt = new Date();
	      checkpoint.photos = data.photos || [];
	      checkpoint.answers = data.answers || [];
	      checkpoint.score = data.score || 10;
	      
	      walk.progress.completedCheckpoints++;
	      walk.rewards.xpEarned += checkpoint.score;
	      
	      // Check if walk is complete
	      if (walk.progress.completedCheckpoints === walk.progress.totalCheckpoints) {
	        walk.status = 'completed';
	        walk.endTime = new Date();
	        walk.duration = Math.round((walk.endTime - walk.startTime) / 60000); // minutes
	        
	        // Calculate distance (simplified)
	        walk.distance = calculateDistance(walk.route.coordinates);
	        
	        // Update user stats if authenticated
	        if (walk.user !== 'anonymous') {
	          await updateUserStats(walk.user, walk);
	        }
	      }
	    }
	  }
	  
	  await walk.save();
	  res.json(walk);
	} catch (error) {
	  res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Get walk details
router.get('/:walkId', async (req, res) => {
	try {
	  const walk = await Walk.findById(req.params.walkId)
	    .populate('quest', '-checkpoints.content.answer');
	  
	  if (!walk) {
	    return res.status(404).json({ message: 'Walk not found' });
	  }
	  
	  res.json(walk);
	} catch (error) {
	  res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Get user's walk history
router.get('/user/:userId', async (req, res) => {
	try {
	  const walks = await Walk.find({ user: req.params.userId })
	    .populate('quest', 'title theme')
	    .sort({ startTime: -1 })
	    .limit(20);
	  
	  res.json(walks);
	} catch (error) {
	  res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Complete walk
router.put('/:walkId/complete', async (req, res) => {
	try {
	  const { rating, review, photos } = req.body;
	  
	  const walk = await Walk.findById(req.params.walkId);
	  if (!walk) {
	    return res.status(404).json({ message: 'Walk not found' });
	  }
	  
	  walk.status = 'completed';
	  walk.endTime = new Date();
	  walk.duration = Math.round((walk.endTime - walk.startTime) / 60000);
	  walk.distance = calculateDistance(walk.route.coordinates);
	  walk.rating = rating;
	  walk.review = review;
	  walk.photos = photos || [];
	  
	  // Update user stats if authenticated
	  if (walk.user !== 'anonymous') {
	    await updateUserStats(walk.user, walk);
	  }
	  
	  await walk.save();
	  res.json(walk);
	} catch (error) {
	  res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// Helper functions
function calculateDistance(coordinates) {
	let distance = 0;
	for (let i = 1; i < coordinates.length; i++) {
	  const [lng1, lat1] = coordinates[i - 1];
	  const [lng2, lat2] = coordinates[i];
	  distance += haversineDistance(lat1, lng1, lat2, lng2);
	}
	return Math.round(distance);
}

function haversineDistance(lat1, lng1, lat2, lng2) {
	const R = 6371e3; // Earth's radius in meters
	const φ1 = lat1 * Math.PI / 180;
	const φ2 = lat2 * Math.PI / 180;
	const Δφ = (lat2 - lat1) * Math.PI / 180;
	const Δλ = (lng2 - lng1) * Math.PI / 180;

	const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
	  Math.cos(φ1) * Math.cos(φ2) *
	  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}

async function updateUserStats(userId, walk) {
	const user = await User.findById(userId);
	if (!user) return;
	
	user.stats.totalQuests++;
	user.stats.totalDistance += walk.distance;
	user.stats.totalTime += walk.duration;
	user.stats.xp += walk.rewards.xpEarned;
	
	// Level up logic (simplified)
	const newLevel = Math.floor(user.stats.xp / 1000) + 1;
	if (newLevel > user.stats.level) {
	  user.stats.level = newLevel;
	  // Add level up badge
	  user.badges.push({
	    id: `level_${newLevel}`,
	    name: `Level ${newLevel}`,
	    description: `Reached level ${newLevel}`,
	    icon: '🏆'
	  });
	}
	
	// Add completed quest to history
	user.completedQuests.push({
	  questId: walk.quest,
	  completedAt: walk.endTime,
	  photos: walk.photos,
	  score: walk.rewards.xpEarned
	});
	
	await user.save();
}

export default router; 