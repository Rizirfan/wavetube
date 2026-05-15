import { create } from 'zustand';
import { getMyPlaylists, createPlaylist as apiCreatePlaylist, addTrackToPlaylist, removeTrackFromPlaylist, type Playlist } from '../api/playlists';

interface PlaylistState {
  playlists: Playlist[];
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (name: string) => Promise<void>;
  addToPlaylist: (playlistId: string, track: any) => Promise<void>;
  removeFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  fetchPlaylists: async () => {
    try {
      const data = await getMyPlaylists();
      set({ playlists: data });
    } catch (error) {
      console.error('Failed to fetch playlists', error);
    }
  },
  createPlaylist: async (name) => {
    try {
      const newPlaylist = await apiCreatePlaylist(name);
      set({ playlists: [...get().playlists, newPlaylist] });
    } catch (error: any) {
      console.error('Failed to create playlist', error);
      alert(error?.response?.data?.message || 'Error creating playlist. Is the backend running?');
    }
  },
  addToPlaylist: async (playlistId, track) => {
    try {
      const updatedPlaylist = await addTrackToPlaylist(playlistId, track);
      set({
        playlists: get().playlists.map(p => p._id === playlistId ? updatedPlaylist : p)
      });
    } catch (error) {
       console.error('Failed to add track', error);
    }
  },
  removeFromPlaylist: async (playlistId, trackId) => {
    try {
      const updatedPlaylist = await removeTrackFromPlaylist(playlistId, trackId);
      set({
        playlists: get().playlists.map(p => p._id === playlistId ? updatedPlaylist : p)
      });
    } catch (error) {
       console.error('Failed to remove track', error);
    }
  }
}));
