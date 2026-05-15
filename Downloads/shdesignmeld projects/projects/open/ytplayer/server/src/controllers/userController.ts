import { Response } from 'express';
import User from '../models/User';

export const getLikedSongs = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user?.likedSongs || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching liked songs' });
  }
};

export const toggleLikeSong = async (req: any, res: Response) => {
  const { track } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const trackId = track?.id ?? track?.videoId ?? track;
    if (!trackId) return res.status(400).json({ message: 'Invalid track data' });

    const sanitizedTrack = {
      id: String(trackId),
      title: typeof track?.title === 'string' ? track.title : '',
      artist: typeof track?.artist === 'string' ? track.artist : '',
      thumbnail: typeof track?.thumbnail === 'string' ? track.thumbnail : '',
      duration: track?.duration != null ? String(track.duration) : '',
    };

    const likedSongs = (user.likedSongs || []) as any[];
    const index = likedSongs.findIndex((t: any) => {
      if (typeof t === 'string') return t === sanitizedTrack.id;
      return t?.id === sanitizedTrack.id;
    });

    if (index > -1) {
      likedSongs.splice(index, 1);
    } else {
      likedSongs.push(sanitizedTrack);
    }

    // Ensure we assign back (mongoose subdocs can behave oddly when mutating in-place)
    (user as any).likedSongs = likedSongs;

    await user.save();

    return res.json((user as any).likedSongs || []);
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return res.status(500).json({
      message: 'Error toggling like',
      details: error?.message,
    });
  }
};

export const addRecentTrack = async (req: any, res: Response) => {
  const { trackId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Add to beginning, remove if exists
    const filtered = (user.recentlyPlayed as any[]).filter(t => t.trackId !== trackId);
    filtered.unshift({ trackId, playedAt: new Date() });
    
    // Keep only last 20
    (user as any).recentlyPlayed = filtered.slice(0, 20);

    await user.save();
    res.json(user.recentlyPlayed);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to history' });
  }
};
