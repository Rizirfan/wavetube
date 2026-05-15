import { Request, Response } from 'express';
import Playlist from '../models/Playlist';

export const createPlaylist = async (req: any, res: Response) => {
  const { name, description } = req.body;
  try {
    const playlist = await Playlist.create({
      name,
      description,
      owner: req.user._id,
    });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error creating playlist' });
  }
};

export const getMyPlaylists = async (req: any, res: Response) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlists' });
  }
};

export const addTrackToPlaylist = async (req: any, res: Response) => {
  const { playlistId, track } = req.body;
  try {
    const playlist = await Playlist.findOne({ _id: playlistId, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    // Check if track already exists
    if (playlist.tracks.some(t => t.id === track.id)) {
      return res.status(400).json({ message: 'Track already in playlist' });
    }

    playlist.tracks.push(track);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding track' });
  }
};

export const removeTrackFromPlaylist = async (req: any, res: Response) => {
  const { playlistId, trackId } = req.body;
  try {
    const playlist = await Playlist.findOne({ _id: playlistId, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    (playlist as any).tracks = playlist.tracks.filter(t => t.id !== trackId);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error removing track' });
  }
};

export const deletePlaylist = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const result = await Playlist.deleteOne({ _id: id, owner: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Playlist not found' });
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting playlist' });
  }
};
