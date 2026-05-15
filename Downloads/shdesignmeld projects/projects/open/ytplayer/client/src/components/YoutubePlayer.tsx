import YouTube, { type YouTubeProps } from 'react-youtube';
import { usePlayerStore } from '../store/usePlayerStore';
import { useRecentlyPlayedStore } from '../store/useRecentlyPlayedStore';
import { useEffect, useRef } from 'react';


const YoutubePlayer = () => {
  const { 
    currentTrack, isPlaying, volume, isMuted, seekTime,
    playNext, setIsPlaying, setProgress, setDuration, clearSeek
  } = usePlayerStore();

  const addRecentlyPlayed = useRecentlyPlayedStore((s) => s.addRecentlyPlayed);


  
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<any>(null);

  useEffect(() => {
    if (playerRef.current && seekTime !== null) {
      playerRef.current.seekTo(seekTime);
      clearSeek();
    }
  }, [seekTime, clearSeek]);

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(isMuted ? 0 : volume);
    if (isPlaying) {
      playerRef.current.playVideo();
    }
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    // 1: PLAYING, 2: PAUSED
    if (event.data === 1) {
      setIsPlaying(true);
      setDuration(event.target.getDuration());

      // Track recently played
      if (currentTrack) {
        addRecentlyPlayed({
          id: currentTrack.id,
          title: currentTrack.title,
          artist: currentTrack.artist,
          thumbnail: currentTrack.thumbnail,
          duration: currentTrack.duration,
        });
      }
      
      // Start tracking progress

      if (progressInterval.current) clearInterval(progressInterval.current);
      progressInterval.current = setInterval(() => {
        if (playerRef.current) {
          setProgress(playerRef.current.getCurrentTime());
        }
      }, 1000);
    } else if (event.data === 2) {
      setIsPlaying(false);
      if (progressInterval.current) clearInterval(progressInterval.current);
    } else if (event.data === 0) { // ENDED
      if (progressInterval.current) clearInterval(progressInterval.current);
      const { repeatMode } = usePlayerStore.getState();
      if (repeatMode === 'one') {
        // Replay the same track
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      } else {
        playNext();
      }
    }
  };

  if (!currentTrack) return null;

  const opts: YouTubeProps['opts'] = {
    height: '1',
    width: '1',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      showinfo: 0,
    },
  };

  return (
    <div className="fixed bottom-0 left-0 w-px h-px opacity-0 pointer-events-none overflow-hidden">
      <YouTube videoId={currentTrack.id} opts={opts} onReady={onReady} onStateChange={onStateChange} />
    </div>
  );
};

export default YoutubePlayer;
