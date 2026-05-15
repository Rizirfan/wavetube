import { create } from 'zustand';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffle: boolean;
  currentTime: number;
  duration: number;
  seekTime: number | null;
  isExpanded: boolean;
  
  setCurrentTrack: (track: Track | null) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  setQueue: (queue: Track[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  toggleShuffle: () => void;
  setProgress: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  seekTo: (time: number) => void;
  clearSeek: () => void;
  toggleExpanded: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 80,
  isMuted: false,
  repeatMode: 'none',
  isShuffle: false,
  currentTime: 0,
  duration: 0,
  seekTime: null,
  isExpanded: false,

  setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: !!track, currentTime: 0, duration: 0, seekTime: null }),
  setProgress: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  addToQueue: (track) => set((state) => ({ 
    queue: [...state.queue, track] 
  })),

  removeFromQueue: (trackId) => set((state) => ({
    queue: state.queue.filter(t => t.id !== trackId)
  })),

  setQueue: (queue) => set({ queue }),

  playNext: () => {
    const { queue, currentTrack, isShuffle, repeatMode } = get();
    if (queue.length === 0) return;

    let nextIndex = 0;
    if (currentTrack) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      } else {
        nextIndex = (currentIndex + 1) % queue.length;
      }
    }

    if (repeatMode === 'none' && currentTrack && queue.findIndex(t => t.id === currentTrack.id) === queue.length - 1) {
       set({ isPlaying: false });
       return;
    }

    set({ currentTrack: queue[nextIndex], isPlaying: true });
  },

  playPrevious: () => {
    const { queue, currentTrack } = get();
    if (queue.length === 0) return;

    const currentIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : 0;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    set({ currentTrack: queue[prevIndex], isPlaying: true });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setVolume: (volume) => set({ volume }),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  
  seekTo: (time) => set({ seekTime: time, currentTime: time }),
  clearSeek: () => set({ seekTime: null }),
  
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
}));
