import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  tracks: [{
    id: String,
    title: String,
    artist: String,
    thumbnail: String,
    addedAt: { type: Date, default: Date.now }
  }],
  coverImage: { type: String },
}, { timestamps: true });

export default mongoose.model('Playlist', PlaylistSchema);
