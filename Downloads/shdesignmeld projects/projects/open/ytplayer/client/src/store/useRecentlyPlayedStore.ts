import { create } from 'zustand';

export type RecentlyPlayedTrack = {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
  lastPlayedAt: number;
};

type PlayerTrack = Omit<RecentlyPlayedTrack, 'lastPlayedAt'>;

type RecentlyPlayedState = {
  recentlyPlayed: RecentlyPlayedTrack[];
  maxItems: number;
  addRecentlyPlayed: (track: PlayerTrack) => void;
  clearRecentlyPlayed: () => void;
};

const STORAGE_KEY = 'waveTube.recentlyPlayed.v1';
const DEFAULT_MAX_ITEMS = 20;

const safeParse = (raw: string | null): RecentlyPlayedTrack[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(Boolean)
      .map((t) => ({
        id: String(t.id),
        title: String(t.title ?? ''),
        artist: String(t.artist ?? ''),
        thumbnail: String(t.thumbnail ?? ''),
        duration: t.duration ? String(t.duration) : undefined,
        lastPlayedAt: Number(t.lastPlayedAt ?? 0),
      }))
      .filter((t) => t.id && t.thumbnail);
  } catch {
    return [];
  }
};

export const useRecentlyPlayedStore = create<RecentlyPlayedState>((set) => {
  const initial = safeParse(
    typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
  );

  return {
    recentlyPlayed: initial.sort((a, b) => b.lastPlayedAt - a.lastPlayedAt),
    maxItems: DEFAULT_MAX_ITEMS,

    addRecentlyPlayed: (track) => {
      const now = Date.now();
      set((state) => {
        const next = [
          { ...track, lastPlayedAt: now } as RecentlyPlayedTrack,
          ...state.recentlyPlayed.filter((t) => t.id !== track.id),
        ]
          .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)
          .slice(0, state.maxItems);

        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore storage failures
        }

        return { recentlyPlayed: next };
      });
    },

    clearRecentlyPlayed: () => {
      set({ recentlyPlayed: [] });
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    },
  };
});

