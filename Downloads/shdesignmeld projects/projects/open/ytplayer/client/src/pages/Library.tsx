import { Heart, Play, Clock } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useUserStore } from '../store/useUserStore';

const Library = () => {
  const { setCurrentTrack, setQueue } = usePlayerStore();
  const { likedSongs } = useUserStore();

  const tracks = likedSongs.map(t => {
    if (typeof t === 'string') {
      return {
        id: t,
        title: t,
        artist: 'YouTube',
        thumbnail: `https://img.youtube.com/vi/${t}/hqdefault.jpg`,
      };
    }
    return t;
  });

  const handlePlay = (idx: number) => {
    setQueue(tracks);
    setCurrentTrack(tracks[idx]);
  };

  const playAll = () => {
    if (tracks.length === 0) return;
    setQueue(tracks);
    setCurrentTrack(tracks[0]);
  };

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
        {/* Cover art */}
        <div
          className="w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #FA243C 0%, #7b0016 100%)',
            boxShadow: '0 20px 60px rgba(250,36,60,0.35)',
          }}
        >
          <Heart size={64} fill="white" className="text-white opacity-90" />
          {tracks.length > 0 && (
            <button
              onClick={playAll}
              className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                <Play size={24} fill="black" className="text-black ml-1" />
              </div>
            </button>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: 'var(--text-3)' }}>
            Playlist
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3" style={{ color: 'var(--text-1)' }}>
            Liked Songs
          </h1>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="font-semibold text-primary">You</span>
            <span style={{ color: 'var(--text-3)' }}>·</span>
            <span style={{ color: 'var(--text-2)' }}>
              {tracks.length} song{tracks.length !== 1 ? 's' : ''}
            </span>
          </div>
          {tracks.length > 0 && (
            <button
              onClick={playAll}
              className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-[13px] transition-all hover:scale-105 active:scale-95"
              style={{ background: 'var(--primary)', boxShadow: '0 4px 16px rgba(250,36,60,0.4)' }}
            >
              <Play size={14} fill="white" />
              Play All
            </button>
          )}
        </div>
      </div>

      {/* Track list */}
      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--surface-2)' }}
          >
            <Heart size={36} style={{ color: 'var(--text-3)' }} />
          </div>
          <p className="text-[17px] font-bold" style={{ color: 'var(--text-1)' }}>No liked songs yet</p>
          <p className="text-[13px]" style={{ color: 'var(--text-2)' }}>
            Tap ♥ on any song while it's playing
          </p>
        </div>
      ) : (
        <div className="px-4 md:px-6 pt-2">
          {/* Column headers */}
          <div
            className="grid gap-4 px-4 py-2 mb-1 text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{
              gridTemplateColumns: '32px 1fr auto',
              color: 'var(--text-3)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span>#</span>
            <span>Title</span>
            <Clock size={13} />
          </div>

          {tracks.map((track, idx) => (
            <div
              key={track.id}
              className="grid gap-4 px-4 py-2.5 rounded-lg items-center cursor-pointer group transition-colors hover:bg-white/5"
              style={{ gridTemplateColumns: '32px 1fr auto' }}
              onClick={() => handlePlay(idx)}
            >
              {/* Index / play icon */}
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span
                  className="text-[13px] font-medium group-hover:invisible"
                  style={{ color: 'var(--text-3)' }}
                >
                  {idx + 1}
                </span>
                <Play
                  size={14}
                  fill="currentColor"
                  className="absolute text-white invisible group-hover:visible"
                />
              </div>

              {/* Thumbnail + title */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={track.thumbnail}
                  alt="thumb"
                  className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                  style={{ border: '1px solid var(--border)' }}
                />
                <div className="min-w-0">
                  <p
                    className="text-[13px] font-semibold truncate"
                    style={{ color: 'var(--text-1)' }}
                    dangerouslySetInnerHTML={{ __html: track.title }}
                  />
                  {track.artist && track.artist !== 'YouTube' && (
                    <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-2)' }}>
                      {track.artist}
                    </p>
                  )}
                </div>
              </div>

              {/* Duration placeholder */}
              <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-3)' }}>—</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
