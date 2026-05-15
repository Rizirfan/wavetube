import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Player from './components/Player';
import YoutubePlayer from './components/YoutubePlayer';
import TrackExpandedView from './components/TrackExpandedView';
import Home from './pages/Home';
import Library from './pages/Library';
import RecentlyPlayed from './pages/RecentlyPlayed';
import Login from './pages/Login';
import PlaylistPage from './pages/PlaylistPage';

import MobileNav from './components/MobileNav';
import { useAuth } from './context/AuthContext';
import { useUserStore } from './store/useUserStore';
import { usePlaylistStore } from './store/usePlaylistStore';

function App() {
  const { user, loading } = useAuth();
  const fetchLikedSongs = useUserStore(state => state.fetchLikedSongs);
  const fetchPlaylists = usePlaylistStore(state => state.fetchPlaylists);

  useEffect(() => {
    if (user) {
      fetchLikedSongs();
      fetchPlaylists();
    }
  }, [user, fetchLikedSongs, fetchPlaylists]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-[13px] font-medium" style={{ color: 'var(--text-2)' }}>Loading WaveTube…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      {/* Full viewport shell */}
      <div
        className="flex h-screen overflow-hidden selection:bg-primary/20"
        style={{ background: 'var(--bg)', color: 'var(--text-1)' }}
      >
        {/* Sidebar — hidden on mobile */}
        <Sidebar />

        {/* Main column */}
        <div
          className="flex flex-col flex-1 min-w-0 overflow-hidden"
          style={{ background: 'var(--surface)' }}
        >
          <Navbar />

          {/* Scrollable page content — padded at bottom so player doesn't overlap */}
          <main
            className="flex-1 overflow-hidden"
            /* On mobile the MobileNav sits at bottom-[76px], adding ~46px extra  */
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/playlists" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/recently-played" element={<RecentlyPlayed />} />
              <Route path="/playlist/:id" element={<PlaylistPage />} />


            </Routes>
          </main>
        </div>

        {/* Mobile bottom navigation */}
        <MobileNav />

        {/* Hidden YouTube player engine */}
        <YoutubePlayer />

        {/* Sticky bottom player bar */}
        <Player />

        {/* Full-screen expanded view overlay */}
        <TrackExpandedView />
      </div>
    </Router>
  );
}

export default App;
