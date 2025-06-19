import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	username: {
	  type: String,
	  required: true,
	  unique: true,
	  trim: true
	},
	email: {
	  type: String,
	  required: true,
	  unique: true,
	  trim: true,
	  lowercase: true
	},
	password: {
	  type: String,
	  required: true
	},
	profile: {
	  avatar: String,
	  bio: String,
	  location: {
	    type: {
	      type: String,
	      default: 'Point'
	    },
	    coordinates: [Number] // [longitude, latitude]
	  }
	},
	stats: {
	  totalQuests: { type: Number, default: 0 },
	  totalDistance: { type: Number, default: 0 }, // in meters
	  totalTime: { type: Number, default: 0 }, // in minutes
	  xp: { type: Number, default: 0 },
	  level: { type: Number, default: 1 }
	},
	badges: [{
	  id: String,
	  name: String,
	  description: String,
	  earnedAt: { type: Date, default: Date.now },
	  icon: String
	}],
	completedQuests: [{
	  questId: { type: Schema.Types.ObjectId, ref: 'Quest' },
	  completedAt: { type: Date, default: Date.now },
	  photos: [String],
	  score: Number
	}],
	favoriteWalks: [{
	  type: Schema.Types.ObjectId,
	  ref: 'Walk'
	}]
}, {
	timestamps: true
});

// Index for geospatial queries
userSchema.index({ 'profile.location': '2dsphere' });

const User = model('User', userSchema);

export default User;