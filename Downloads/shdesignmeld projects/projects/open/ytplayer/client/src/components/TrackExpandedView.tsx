import { useState } from 'react';
import {
  Heart, MoreHorizontal, SkipBack, Play, Pause,
  SkipForward, Repeat, Shuffle, Volume2, VolumeX, ChevronDown
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useUserStore } from '../store/useUserStore';
import { formatDuration, cn } from '../lib/utils';
import { PlaylistModal } from './PlaylistModal';

const TrackExpandedView = () => {
  const {
    currentTrack, isExpanded, toggleExpanded,
    isPlaying, togglePlay, playNext, playPrevious,
    currentTime, duration, isShuffle, repeatMode,
    toggleShuffle, setRepeatMode, seekTo,
    volume, isMuted, setVolume, toggleMute,
  } = usePlayerStore();

  const { isLiked, toggleLike } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isExpanded || !currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = isLiked(currentTrack.id);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - bounds.left, bounds.width));
    seekTo((x / bounds.width) * duration);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - bounds.left, bounds.width));
    setVolume(Math.round((x / bounds.width) * 100));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ fontFamily: "'Inter', 'SF Pro Display', sans-serif" }}
    >
      {/* --- Blurred backdrop --- */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${currentTrack.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(60px) saturate(2) brightness(0.3)',
          transform: 'scale(1.1)',
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* === CONTENT: 3-row flex column === */}
      <div className="relative z-10 flex flex-col h-full max-w-lg w-full mx-auto px-6">

        {/* --- Row 1: Header (fixed height) --- */}
        <div className="flex items-center justify-between pt-12 pb-4 flex-shrink-0">
          <button
            onClick={toggleExpanded}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-colors"
          >
            <ChevronDown size={26} strokeWidth={2.5} />
          </button>
          <div className="text-center">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.15em]">Now Playing</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-colors"
          >
            <MoreHorizontal size={22} />
          </button>
        </div>

        {/* --- Row 2: Album Art (flex-grow, capped) --- */}
        <div className="flex-1 flex items-center justify-center py-4 min-h-0">
          <div
            className="w-full aspect-square rounded-3xl overflow-hidden"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)',
            }}
          >
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* --- Row 3: Controls panel (fixed, no scroll) --- */}
        <div className="flex-shrink-0 pb-8 space-y-5">

          {/* Track info + like */}
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2
                className="text-white font-bold text-[20px] leading-tight truncate"
                dangerouslySetInnerHTML={{ __html: currentTrack.title }}
              />
              <p className="text-white/50 text-[14px] font-medium mt-0.5 truncate">
                {currentTrack.artist || 'Unknown Artist'}
              </p>
            </div>
            <button
              onClick={() => toggleLike(currentTrack)}
              className={cn(
                "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90",
                liked
                  ? "text-white bg-white/15"
                  : "text-white/40 hover:text-white/80"
              )}
            >
              <Heart
                size={22}
                fill={liked ? "currentColor" : "none"}
                strokeWidth={2}
                className={liked ? "text-red-400" : ""}
              />
            </button>
          </div>

          {/* Progress bar */}
          <div>
            <div
              className="h-1 w-full bg-white/20 rounded-full cursor-pointer relative group"
              onClick={handleSeek}
            >
              <div
                className="absolute left-0 top-0 h-full bg-white rounded-full"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-white/40 text-[11px] font-semibold tabular-nums">
                {formatDuration(currentTime)}
              </span>
              <span className="text-white/40 text-[11px] font-semibold tabular-nums">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={toggleShuffle}
              className={cn(
                "w-10 h-10 flex items-center justify-center transition-all active:scale-90",
                isShuffle ? "text-primary" : "text-white/40 hover:text-white"
              )}
            >
              <Shuffle size={20} />
            </button>

            <button
              onClick={playPrevious}
              className="w-12 h-12 flex items-center justify-center text-white hover:text-white/70 active:scale-90 transition-all"
            >
              <SkipBack size={32} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className="w-[68px] h-[68px] bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              style={{ boxShadow: '0 8px 32px rgba(255,255,255,0.25)' }}
            >
              {isPlaying
                ? <Pause size={30} fill="currentColor" />
                : <Play size={30} fill="currentColor" className="ml-1" />
              }
            </button>

            <button
              onClick={playNext}
              className="w-12 h-12 flex items-center justify-center text-white hover:text-white/70 active:scale-90 transition-all"
            >
              <SkipForward size={32} fill="currentColor" />
            </button>

            <button
              onClick={() => setRepeatMode(
                repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none'
              )}
              className={cn(
                "w-10 h-10 flex items-center justify-center relative transition-all active:scale-90",
                repeatMode !== 'none' ? "text-primary" : "text-white/40 hover:text-white"
              )}
            >
              <Repeat size={20} />
              {repeatMode === 'one' && (
                <span className="absolute bottom-1 right-1 text-[9px] font-black text-primary leading-none">1</span>
              )}
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="text-white/40 hover:text-white transition-colors flex-shrink-0"
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div
              className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer relative group"
              onClick={handleVolumeClick}
            >
              <div
                className="absolute left-0 top-0 h-full bg-white/60 rounded-full"
                style={{ width: `${isMuted ? 0 : volume}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${isMuted ? 0 : volume}%` }}
              />
            </div>
            <Volume2 size={16} className="text-white/40 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Playlist modal */}
      <PlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trackToAdd={currentTrack}
      />
    </div>
  );
};

export default TrackExpandedView;
