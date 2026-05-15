import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const searchMusic = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/music/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching from backend search:', error);
    return [];
  }
};

export const getTrendingMusic = async () => {
  try {
    const response = await axios.get(`${API_URL}/music/trending`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending music from backend:', error);
    return [];
  }
};
