import { create } from 'zustand';
import { searchMusic } from '../api/youtube';

interface SearchState {
  query: string;
  results: any[];
  isLoading: boolean;
  searchTimeout: any;
  setQuery: (query: string) => void;
  search: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  isLoading: false,
  searchTimeout: null,
  setQuery: (query) => set({ query }),
  search: (query) => {
    // Clear existing timeout
    const currentTimeout = get().searchTimeout;
    if (currentTimeout) clearTimeout(currentTimeout);

    if (!query.trim()) {
      set({ results: [], query: '', isLoading: false });
      return;
    }

    set({ query, isLoading: true });

    // Set new debounce timeout (500ms)
    const timeout = setTimeout(async () => {
      try {
        const results = await searchMusic(query);
        set({ results, isLoading: false });
      } catch (error) {
        console.error('Search error:', error);
        set({ isLoading: false });
      }
    }, 500);

    set({ searchTimeout: timeout });
  },
}));
