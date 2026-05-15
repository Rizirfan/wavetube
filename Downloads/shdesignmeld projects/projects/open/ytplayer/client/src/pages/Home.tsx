import { useEffect, useState } from 'react';
import { Play, TrendingUp, Sparkles, ListMusic, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import { useSearchStore } from '../store/useSearchStore';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { getTrendingMusic } from '../api/youtube';

/* ── TrackCard ─────────────────────────────────────────── */
const TrackCard = ({ track, onPlay }: { track: any; onPlay: () => void }) => (
  <div className="apple-card group" onClick={onPlay}>
    <div
      className="aspect-square rounded-xl overflow-hidden mb-3 relative"
      style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}
    >
      <img
        src={track.thumbnail}
        alt={track.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Play overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
          <Play size={16} fill="black" className="text-black ml-0.5" />
        </div>
      </div>
    </div>
    <h3
      className="text-[13px] font-semibold truncate leading-snug"
      style={{ color: 'var(--text-1)' }}
      dangerouslySetInnerHTML={{ __html: track.title }}
    />
    <p className="text-[11px] font-medium truncate mt-0.5" style={{ color: 'var(--text-2)' }}>
      {track.artist}
    </p>
  </div>
);

/* ── PlaylistCard ──────────────────────────────────────── */
const PlaylistCard = ({ playlist }: { playlist: any }) => (
  <Link to={`/playlist/${playlist._id}`} className="apple-card group block">
    <div
      className="aspect-square rounded-xl overflow-hidden mb-3 relative flex items-center justify-center"
      style={{
        background: playlist.tracks[0] ? 'transparent' : 'var(--surface-2)',
        border: '1px solid var(--border)'
      }}
    >
      {playlist.tracks[0] ? (
        <img
          src={playlist.tracks[0].thumbnail}
          alt={playlist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <ListMusic size={36} style={{ color: 'var(--text-3)' }} />
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
          <Play size={16} fill="black" className="text-black ml-0.5" />
        </div>
      </div>
    </div>
    <h3
      className="text-[13px] font-semibold truncate leading-snug"
      style={{ color: 'var(--text-1)' }}
    >
      {playlist.name}
    </h3>
    <p className="text-[11px] font-medium truncate mt-0.5" style={{ color: 'var(--text-2)' }}>
      {playlist.tracks?.length || 0} song{playlist.tracks?.length !== 1 ? 's' : ''}
    </p>
  </Link>
);

/* ── SkeletonCard ──────────────────────────────────────── */
const SkeletonCard = () => (
  <div>
    <div className="aspect-square rounded-xl skeleton mb-3" />
    <div className="h-3 rounded-md skeleton w-3/4 mb-2" />
    <div className="h-2.5 rounded-md skeleton w-1/2" />
  </div>
);

/* ── FeaturedBanner ────────────────────────────────────── */
// (Removed Listen Now banners) FeaturedBanner kept only if needed later.
// const FeaturedBanner = (...) => ...


/* ── Section Header ────────────────────────────────────── */
const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon size={16} className="text-primary" />
    <h2 className="text-[17px] font-bold" style={{ color: 'var(--text-1)' }}>{title}</h2>
  </div>
);

/* ── Home ──────────────────────────────────────────────── */
const Home = () => {
  const { results, query, isLoading } = useSearchStore();
  const [trending, setTrending] = useState<any[]>([]);
  const { setCurrentTrack, setQueue } = usePlayerStore();
  const { playlists, createPlaylist } = usePlaylistStore();

  useEffect(() => {
    getTrendingMusic().then(setTrending);
  }, []);

  const play = (tracks: any[], idx: number) => {
    setQueue(tracks);
    setCurrentTrack(tracks[idx]);
  };

  /* ── State for custom create playlist modal ── */
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreateModalOpen(false);
    }
  };

  /* ── Search results ── */
  if (query) {
    return (
      <div
        className="h-full overflow-y-auto custom-scrollbar no-scrollbar fade-in"
        style={{ paddingBottom: 'calc(var(--player-h) + 24px)' }}
      >
        <div className="px-4 md:px-8 pt-6">
          <SectionHeader icon={Sparkles} title={`Results for "${query}"`} />
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5">
              {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="text-[17px] font-semibold" style={{ color: 'var(--text-1)' }}>No results found</p>
              <p className="text-[13px]" style={{ color: 'var(--text-2)' }}>Try different keywords</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5">
              {results.map((t, i) => <TrackCard key={t.id} track={t} onPlay={() => play(results, i)} />)}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Main home ── */
  return (
    <>
      <div
        className="h-full overflow-y-auto custom-scrollbar no-scrollbar fade-in"
        style={{ paddingBottom: 'calc(var(--player-h) + 24px)' }}
      >
        <div className="px-4 md:px-8 pt-6 space-y-10">



          {/* Your Playlists */}
          <section>
            <SectionHeader icon={ListMusic} title="Your Playlists" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5">
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="apple-card group flex flex-col items-start w-full text-left"
              >
                <div
                  className="w-full aspect-square rounded-xl mb-3 flex items-center justify-center transition-colors group-hover:bg-primary/20"
                  style={{ background: 'var(--surface-3)', border: '1px dashed var(--border)' }}
                >
                  <PlusCircle size={32} className="text-primary" />
                </div>
                <h3 className="text-[13px] font-semibold truncate leading-snug w-full" style={{ color: 'var(--text-1)' }}>
                  Create Playlist
                </h3>
                <p className="text-[11px] font-medium truncate mt-0.5 w-full" style={{ color: 'var(--text-2)' }}>
                  Curate your music
                </p>
              </button>
              {playlists.map((pl) => (
                <PlaylistCard key={pl._id} playlist={pl} />
              ))}
            </div>
          </section>

          {/* Trending tracks */}
          <section>
            <SectionHeader icon={TrendingUp} title="Trending Now" />
            {trending.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5">
                {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5">
                {trending.map((t, i) => <TrackCard key={t.id} track={t} onPlay={() => play(trending, i)} />)}
              </div>
            )}
          </section>

        </div>
      </div>

      {/* Custom Create Playlist Modal */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm rounded-2xl p-6 scale-in"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-3)' }}>
                <ListMusic size={20} className="text-primary" />
              </div>
              <h2 className="text-[18px] font-bold" style={{ color: 'var(--text-1)' }}>New Playlist</h2>
            </div>
            
            <input
              autoFocus
              type="text"
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreatePlaylist()}
              className="w-full px-4 py-3 rounded-xl mb-5 text-[14px] outline-none transition-all"
              style={{
                background: 'var(--surface-3)',
                border: '1px solid var(--border)',
                color: 'var(--text-1)',
                caretColor: 'var(--primary)'
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(250,36,60,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors hover:bg-white/10"
                style={{ color: 'var(--text-2)' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
                className="px-5 py-2 rounded-lg text-[13px] font-semibold transition-all disabled:opacity-50"
                style={{ background: 'var(--primary)', color: 'white' }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;


