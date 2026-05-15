import apiClient from './client';

export interface Playlist {
  _id: string;
  name: string;
  tracks: any[];
  user: string;
}

export const getMyPlaylists = async (): Promise<Playlist[]> => {
  const res = await apiClient.get('/playlists');
  return res.data;
};

export const createPlaylist = async (name: string): Promise<Playlist> => {
  const res = await apiClient.post('/playlists', { name });
  return res.data;
};

export const addTrackToPlaylist = async (playlistId: string, track: any) => {
  const res = await apiClient.post('/playlists/add', { playlistId, track });
  return res.data;
};

export const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
  const res = await apiClient.post('/playlists/remove', { playlistId, trackId });
  return res.data;
};

export const deletePlaylist = async (playlistId: string) => {
  const res = await apiClient.delete(`/playlists/${playlistId}`);
  return res.data;
};
