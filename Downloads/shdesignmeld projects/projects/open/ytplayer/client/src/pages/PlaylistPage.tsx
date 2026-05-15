import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Music2, Play, Trash2, Clock, Shuffle } from 'lucide-react';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { usePlayerStore } from '../store/usePlayerStore';

const PlaylistPage = () => {
  const { id } = useParams<{ id: string }>();
  const { playlists, fetchPlaylists, removeFromPlaylist } = usePlaylistStore();
  const { setCurrentTrack, setQueue, toggleShuffle, isShuffle } = usePlayerStore();

  useEffect(() => {
    // Mobile refresh/navigation can land here before Zustand playlists are hydrated.
    // Ensure playlists are available so playlist.tracks renders.
    if (!playlists.length) {
      fetchPlaylists();
    }
  }, [fetchPlaylists, playlists.length]);

  const playlist = playlists.find(p => p._id === id);

  const handlePlay = (idx: number) => {
    if (!playlist?.tracks.length) return;
    setQueue(playlist.tracks);
    setCurrentTrack(playlist.tracks[idx]);
  };

  const handlePlayAll = () => handlePlay(0);

  const handleShuffle = () => {
    if (!playlist?.tracks.length) return;
    const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentTrack(shuffled[0]);
    if (!isShuffle) toggleShuffle();
  };

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--surface-2)' }}
        >
          <Music2 size={36} style={{ color: 'var(--text-3)' }} />
        </div>
        <p className="text-[17px] font-bold" style={{ color: 'var(--text-1)' }}>Playlist not found</p>
        <p className="text-[13px]" style={{ color: 'var(--text-2)' }}>
          This playlist may have been deleted.
        </p>
      </div>
    );
  }

  const coverTrack = playlist.tracks[0];

  return (
    <div
      className="h-full overflow-y-auto custom-scrollbar no-scrollbar fade-in"
      style={{ paddingBottom: 'calc(var(--player-h) + 24px)' }}
    >
      {/* Hero header */}
      <div
        className="px-6 md:px-10 pt-10 pb-8 flex flex-col sm:flex-row items-start sm:items-end gap-6"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* Cover */}
        <div
          className="w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 rounded-2xl overflow-hidden relative shadow-2xl"
          style={{
            background: coverTrack
              ? 'transparent'
              : 'linear-gradient(135deg, var(--primary) 0%, #1a3a5c 100%)',
            border: '1px solid var(--border)',
          }}
        >
          {coverTrack ? (
            <img src={coverTrack.thumbnail} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music2 size={48} style={{ color: 'rgba(255,255,255,0.4)' }} />
            </div>
          )}
          {playlist.tracks.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                <Play size={24} fill="black" className="ml-1 text-black" />
              </div>
            </button>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: 'var(--text-3)' }}>
            Playlist
          </p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3" style={{ color: 'var(--text-1)' }}>
            {playlist.name}
          </h1>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="font-semibold text-primary">You</span>
            <span style={{ color: 'var(--text-3)' }}>·</span>
            <span style={{ color: 'var(--text-2)' }}>
              {playlist.tracks.length} song{playlist.tracks.length !== 1 ? 's' : ''}
            </span>
          </div>

          {playlist.tracks.length > 0 && (
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-[13px] transition-all hover:scale-105 active:scale-95"
                style={{ background: 'var(--primary)', boxShadow: '0 4px 16px rgba(250,36,60,0.4)' }}
              >
                <Play size={14} fill="white" />
                Play
              </button>
              <button
                onClick={handleShuffle}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-1)',
                }}
              >
                <Shuffle size={14} />
                Shuffle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Track list */}
      {playlist.tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Music2 size={40} style={{ color: 'var(--text-3)' }} />
          <p className="text-[17px] font-bold" style={{ color: 'var(--text-1)' }}>No songs yet</p>
          <p className="text-[13px]" style={{ color: 'var(--text-2)' }}>
            Add songs using the "..." button on any track
          </p>
        </div>
      ) : (
        <div className="px-4 md:px-6 pt-2">
          {/* Column headers */}
          <div
            className="grid gap-4 px-4 py-2 mb-1 text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{
              gridTemplateColumns: '32px 1fr auto auto',
              color: 'var(--text-3)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span>#</span>
            <span>Title</span>
            <Clock size={13} />
            <span />
          </div>

          {playlist.tracks.map((track: any, idx: number) => (
            <div
              key={`${track.id}-${idx}`}
              className="grid gap-4 px-4 py-2.5 rounded-lg items-center group transition-colors hover:bg-white/5"
              style={{ gridTemplateColumns: '32px 1fr auto auto' }}
            >
              {/* Index / play */}
              <div
                className="relative w-5 h-5 flex items-center justify-center cursor-pointer"
                onClick={() => handlePlay(idx)}
              >
                <span className="text-[13px] font-medium group-hover:invisible" style={{ color: 'var(--text-3)' }}>
                  {idx + 1}
                </span>
                <Play size={14} fill="white" className="absolute text-white invisible group-hover:visible" />
              </div>

              {/* Thumbnail + title/artist */}
              <div
                className="flex items-center gap-3 min-w-0 cursor-pointer"
                onClick={() => handlePlay(idx)}
              >
                <img
                  src={track.thumbnail}
                  className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                  style={{ border: '1px solid var(--border)' }}
                  alt={track.title}
                />
                <div className="min-w-0">
                  <p
                    className="text-[13px] font-semibold truncate"
                    style={{ color: 'var(--text-1)' }}
                    dangerouslySetInnerHTML={{ __html: track.title }}
                  />
                  <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-2)' }}>
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-3)' }}>
                {track.duration || '—'}
              </span>

              {/* Remove */}
              <button
                onClick={() => removeFromPlaylist(playlist._id, track.id)}
                className="w-7 h-7 flex items-center justify-center rounded-full transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/15"
                style={{ color: 'var(--text-3)' }}
                title="Remove"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
