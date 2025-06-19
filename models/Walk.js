import mongoose from 'mongoose';

const walkSchema = new mongoose.Schema({
	user: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'User',
	  required: true
	},
	quest: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Quest',
	  required: true
	},
	status: {
	  type: String,
	  enum: ['active', 'paused', 'completed', 'abandoned'],
	  default: 'active'
	},
	startTime: {
	  type: Date,
	  default: Date.now
	},
	endTime: Date,
	duration: Number, // in minutes
	distance: Number, // in meters
	route: {
	  type: {
	    type: String,
	    default: 'LineString'
	  },
	  coordinates: [[Number]] // Array of [longitude, latitude] pairs
	},
	checkpoints: [{
	  checkpointId: mongoose.Schema.Types.ObjectId,
	  order: Number,
	  completed: { type: Boolean, default: false },
	  completedAt: Date,
	  photos: [String],
	  answers: [String],
	  score: Number
	}],
	progress: {
	  currentCheckpoint: { type: Number, default: 0 },
	  completedCheckpoints: { type: Number, default: 0 },
	  totalCheckpoints: { type: Number, default: 0 }
	},
	rewards: {
	  xpEarned: { type: Number, default: 0 },
	  badgesEarned: [String],
	  itemsCollected: [String]
	},
	weather: {
	  condition: String,
	  temperature: Number,
	  humidity: Number
	},
	notes: String,
	photos: [String],
	rating: {
	  type: Number,
	  min: 1,
	  max: 5
	},
	review: String
}, {
	timestamps: true
});

// Indexes for efficient queries
walkSchema.index({ user: 1, status: 1 });
walkSchema.index({ quest: 1, status: 1 });
walkSchema.index({ startTime: -1 });

export default mongoose.model('Walk', walkSchema); 