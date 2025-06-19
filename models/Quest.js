import mongoose from 'mongoose';

const checkpointSchema = new mongoose.Schema({
	order: {
	  type: Number,
	  required: true
	},
	location: {
	  type: {
	    type: String,
	    default: 'Point'
	  },
	  coordinates: [Number] // [longitude, latitude]
	},
	type: {
	  type: String,
	  enum: ['story', 'photo', 'trivia', 'riddle', 'collection'],
	  required: true
	},
	title: {
	  type: String,
	  required: true
	},
	description: { 
	  type: String, 
	  required: true 
	},
	content: {
	  storyPrompt: String,
	  photoTask: String,
	  question: String,
	  answer: String,
	  hints: [String],
	  reward: {
	    xp: { type: Number, default: 10 },
	    badge: String
	  }
	},
	completed: { 
	  type: Boolean, 
	  default: false 
	}
});

const questSchema = new mongoose.Schema({
	title: {
	  type: String,
	  required: true,
	  trim: true
	},
	theme: {
	  type: String,
	  required: true,
	  enum: ['pirate', 'romantic', 'nature', 'detective', 'fantasy', 'sci-fi', 'historical', 'holiday']
	},
	description: {
	  type: String,
	  required: true
	},
	difficulty: {
	  type: String,
	  enum: ['easy', 'medium', 'hard'],
	  default: 'medium'
	},
	estimatedTime: {
	  type: Number, // in minutes
	  required: true
	},
	estimatedDistance: {
	  type: Number, // in meters
	  required: true
	},
	startLocation: {
	  type: {
	    type: String,
	    default: 'Point'
	  },
	  coordinates: [Number] // [longitude, latitude]
	},
	route: {
	  type: {
	    type: String,
	    default: 'LineString'
	  },
	  coordinates: [[Number]] // Array of [longitude, latitude] pairs
	},
	checkpoints: [checkpointSchema],
	rewards: {
	  xp: { type: Number, default: 100 },
	  badges: [String],
	  unlockableQuests: [String]
	},
	requirements: {
	  minLevel: { type: Number, default: 1 },
	  requiredBadges: [String],
	  weatherConditions: [String]
	},
	isPremium: { type: Boolean, default: false },
	isActive: { type: Boolean, default: true },
	tags: [String],
	coverImage: String,
	creator: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'User'
	}
}, {
	timestamps: true
});

// Indexes for geospatial queries and search
questSchema.index({ startLocation: '2dsphere' });
questSchema.index({ theme: 1, difficulty: 1 });
questSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Quest', questSchema); 