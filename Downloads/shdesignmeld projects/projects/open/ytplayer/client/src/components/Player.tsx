import { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, 
  VolumeX, Heart, MoreHorizontal, ChevronUp
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { formatDuration, cn } from '../lib/utils';
import { useUserStore } from '../store/useUserStore';
import { PlaylistModal } from './PlaylistModal';

const Player = () => {
  const { 
    currentTrack, isPlaying, volume, isMuted, repeatMode, isShuffle,
    currentTime, duration,
    togglePlay, playNext, playPrevious, toggleMute, 
    setRepeatMode, toggleShuffle, setVolume, toggleExpanded 
  } = usePlayerStore();
  
  const { isLiked, toggleLike } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = currentTrack ? isLiked(currentTrack.id) : false;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - bounds.left, bounds.width));
    usePlayerStore.getState().seekTo((x / bounds.width) * duration);
  };

  return (
    <>
      {/* Progress bar — sits flush on top of player */}
      <div
        className="fixed bottom-[76px] md:bottom-0 left-0 w-full h-[3px] z-50 cursor-pointer group"
        style={{ background: 'rgba(255,255,255,0.08)' }}
        onClick={handleSeek}
      >
        <div
          className="h-full transition-none bg-primary/80 group-hover:bg-primary"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress}%` }}
        />
      </div>

      <footer
        className="fixed bottom-0 left-0 w-full z-50 apple-player select-none"
        style={{ height: 'var(--player-h)' }}
      >
        <div className="flex items-center h-full px-4 md:px-6 gap-2">

          {/* ── Track Info (left 1/3) ── */}
          <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-1/3">
            {currentTrack ? (
              <>
                {/* Thumbnail — clickable to expand */}
                <button
                  onClick={toggleExpanded}
                  className="relative flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-lg overflow-hidden group/thumb shadow-md"
                >
                  <img
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                    <ChevronUp size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                </button>

                {/* Title / Artist */}
                <button
                  onClick={toggleExpanded}
                  className="min-w-0 flex-1 text-left group/text"
                >
                  <h4
                    className="text-[13px] font-semibold text-white truncate leading-tight group-hover/text:text-primary transition-colors"
                    dangerouslySetInnerHTML={{ __html: currentTrack.title }}
                  />
                  <p className="text-[11px] text-[#71717a] truncate mt-0.5">{currentTrack.artist || 'Unknown'}</p>
                </button>

                {/* Like */}
                <button
                  onClick={() => toggleLike(currentTrack)}
                  className={cn(
                    "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all",
                    liked ? "text-primary" : "text-[#52525b] hover:text-[#a1a1aa]"
                  )}
                >
                  <Heart size={15} fill={liked ? 'currentColor' : 'none'} strokeWidth={2} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg skeleton" />
                <div className="space-y-1.5 hidden md:block">
                  <div className="w-28 h-3 rounded skeleton" />
                  <div className="w-18 h-2.5 rounded skeleton" />
                </div>
              </div>
            )}
          </div>

          {/* ── Center Controls — hidden on mobile (just play+next) ── */}
          {/* Mobile: compact play + next only, centered on right side */}
          <div className="flex items-center gap-3 md:hidden ml-auto">
            <button onClick={togglePlay} className="w-9 h-9 flex items-center justify-center text-white active:scale-90 transition-transform">
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={playNext} className="w-9 h-9 flex items-center justify-center text-[#71717a] active:scale-90 transition-transform">
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>

          {/* Desktop: full controls centered */}
          <div className="hidden md:flex flex-col items-center gap-2 flex-1 md:w-1/3">
            {/* Buttons row */}
            <div className="flex items-center gap-5">
              <button
                onClick={toggleShuffle}
                className={cn("transition-colors active:scale-90 relative", isShuffle ? "text-primary" : "text-[#52525b] hover:text-white")}
              >
                <Shuffle size={15} />
                {isShuffle && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
              </button>

              <button onClick={playPrevious} className="text-white hover:text-primary transition-colors active:scale-90">
                <SkipBack size={22} fill="currentColor" />
              </button>

              <button
                onClick={togglePlay}
                className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                {isPlaying
                  ? <Pause size={18} fill="currentColor" />
                  : <Play size={18} fill="currentColor" className="ml-0.5" />
                }
              </button>

              <button onClick={playNext} className="text-white hover:text-primary transition-colors active:scale-90">
                <SkipForward size={22} fill="currentColor" />
              </button>

              <button
                onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
                className={cn("transition-colors active:scale-90 relative", repeatMode !== 'none' ? "text-primary" : "text-[#52525b] hover:text-white")}
              >
                <Repeat size={15} />
                {repeatMode === 'one' && (
                  <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold text-primary leading-none">1</span>
                )}
                {repeatMode !== 'none' && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
              </button>
            </div>

            {/* Seekable progress bar / time */}
            <div className="flex items-center gap-2 w-full max-w-[480px]">
              <span className="text-[10px] font-medium text-[#52525b] tabular-nums w-8 text-right">
                {formatDuration(currentTime)}
              </span>
              <div
                className="flex-1 h-[3px] bg-white/10 rounded-full relative group/seek cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-white/80 group-hover/seek:bg-white rounded-full transition-colors"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/seek:opacity-100 transition-opacity"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-[#52525b] tabular-nums w-8">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* ── Right Side Controls (desktop) ── */}
          <div className="hidden md:flex items-center justify-end gap-3 md:w-1/3">
            {/* Volume */}
            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="text-[#52525b] hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <div
                className="w-22 h-[3px] bg-white/10 rounded-full relative cursor-pointer group/volbar"
                style={{ width: '88px' }}
                onClick={(e) => {
                  const b = e.currentTarget.getBoundingClientRect();
                  setVolume(Math.round(Math.max(0, Math.min(e.clientX - b.left, b.width)) / b.width * 100));
                }}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-white/50 group-hover/volbar:bg-white/80 rounded-full transition-colors"
                  style={{ width: `${isMuted ? 0 : volume}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover/volbar:opacity-100 transition-opacity shadow"
                  style={{ left: `${isMuted ? 0 : volume}%` }}
                />
              </div>
            </div>

            {/* More / Add to Playlist */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-[#52525b] hover:text-white hover:bg-white/8 transition-all"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

        </div>
      </footer>

      <PlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trackToAdd={currentTrack}
      />
    </>
  );
};

export default Player;
