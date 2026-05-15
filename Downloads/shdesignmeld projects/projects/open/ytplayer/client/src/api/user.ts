import apiClient from './client';

export const getLikedSongs = async () => {
  const res = await apiClient.get('/users/liked-songs');
  return res.data;
};

export const toggleLikeSong = async (track: any) => {
  const res = await apiClient.post('/users/like', { track });
  return res.data;
};
