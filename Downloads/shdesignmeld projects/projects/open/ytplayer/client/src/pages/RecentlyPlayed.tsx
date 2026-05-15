import { useMemo } from 'react';
import { Play, Clock, Trash2 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useRecentlyPlayedStore } from '../store/useRecentlyPlayedStore';

const RecentlyPlayed = () => {
  const { setCurrentTrack, setQueue } = usePlayerStore();
  const { recentlyPlayed, clearRecentlyPlayed } = useRecentlyPlayedStore();

  const tracks = useMemo(() => recentlyPlayed, [recentlyPlayed]);

  const handlePlay = (idx: number) => {
    if (tracks.length === 0) return;
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
      <div
        className="px-6 md:px-10 pt-10 pb-8 flex flex-col sm:flex-row items-start sm:items-end gap-6"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(250,36,60,0.9) 0%, #1a3a5c 100%)',
            boxShadow: '0 20px 60px rgba(250,36,60,0.25)',
          }}
        >
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 20%, white 0%, transparent 55%)' }} />
          <div className="relative z-10 flex items-center justify-center">
            <Clock size={72} color="white" />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: 'var(--text-3)' }}>
            Library
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3" style={{ color: 'var(--text-1)' }}>
            Recently Played
          </h1>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="font-semibold text-primary">You</span>
            <span style={{ color: 'var(--text-3)' }}>·</span>
            <span style={{ color: 'var(--text-2)' }}>
              {tracks.length} track{tracks.length === 1 ? '' : 's'}
            </span>
          </div>

          {tracks.length > 0 && (
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <button
                onClick={playAll}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-[13px] transition-all hover:scale-105 active:scale-95"
                style={{ background: 'var(--primary)', boxShadow: '0 4px 16px rgba(250,36,60,0.4)' }}
              >
                <Play size={14} fill="white" />
                Play All
              </button>
              <button
                onClick={clearRecentlyPlayed}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
                title="Clear recently played"
              >
                <Trash2 size={14} />
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
            <Clock size={36} style={{ color: 'var(--text-3)' }} />
          </div>
          <p className="text-[17px] font-bold" style={{ color: 'var(--text-1)' }}>No recently played yet</p>
          <p className="text-[13px]" style={{ color: 'var(--text-2)' }}>Play a track to see it here</p>
        </div>
      ) : (
        <div className="px-4 md:px-6 pt-2">
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
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span className="text-[13px] font-medium group-hover:invisible" style={{ color: 'var(--text-3)' }}>
                  {idx + 1}
                </span>
                <Play
                  size={14}
                  fill="currentColor"
                  className="absolute text-white invisible group-hover:visible"
                />
              </div>

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
                  {track.artist && (
                    <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-2)' }}>
                      {track.artist}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-3)' }}>
                —
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyPlayed;

