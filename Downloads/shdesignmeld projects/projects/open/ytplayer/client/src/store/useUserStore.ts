import { create } from 'zustand';
import { getLikedSongs, toggleLikeSong as apiToggleLikeSong } from '../api/user';

interface UserState {
  likedSongs: any[];
  fetchLikedSongs: () => Promise<void>;
  toggleLike: (track: any) => Promise<void>;
  isLiked: (trackId: string) => boolean;
}

/**
 * Normalize backend likedSongs into a consistent shape for comparison.
 * Backend stores `track` items and returns them as `user.likedSongs`.
 * Those items might be strings, or objects with `id` or `videoId`.
 */
const normalizeLikedSongs = (data: any[]): any[] => {
  if (!Array.isArray(data)) return [];
  return data.map((item: any) => {
    if (typeof item === 'string') return item;

    // If backend stored a full track object, ensure we always have `id` for comparison.
    const id = item?.id ?? item?.videoId;
    return id ? { ...item, id } : item;
  });
};

export const useUserStore = create<UserState>((set, get) => ({
  likedSongs: [],
  fetchLikedSongs: async () => {
    try {
      const data = await getLikedSongs();
      set({ likedSongs: normalizeLikedSongs(data) });
    } catch (error) {
      console.error('Failed to fetch liked songs', error);
    }
  },

  toggleLike: async (track) => {
    try {
      const trackId = track?.id ?? track?.videoId ?? track;
      console.log('[Like] toggleLike called with:', { track, trackId });

      if (!trackId) {
        console.warn('[Like] No trackId found, aborting toggleLike');
        return;
      }

      // Backend expects `track.id` (see server userController toggleLikeSong).
      const payload = typeof track === 'object' ? { ...track, id: trackId } : { id: trackId };
      console.log('[Like] payload sent to API:', payload);

      const updatedLikes = await apiToggleLikeSong(payload);
      console.log('[Like] API returned updatedLikes:', updatedLikes);

      set({ likedSongs: normalizeLikedSongs(updatedLikes) });
    } catch (error) {
      console.error('Failed to toggle like', error);
    }
  },

  isLiked: (trackId) => {
    const likes = get().likedSongs;
    return likes.some((t: any) => {
      if (typeof t === 'string') return t === trackId;
      return t?.id === trackId || t?.videoId === trackId;
    });
  },
}));
