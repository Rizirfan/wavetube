import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: { type: String },
  photoURL: { type: String },
  likedSongs: [{
    id: String,
    title: String,
    artist: String,
    thumbnail: String,
    duration: String
  }],
  recentlyPlayed: [{
    trackId: String,
    playedAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
