import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for video player controls
 */
export const useVideoPlayer = (options = {}) => {
  const {
    autoplay = true,
    muted = true,
    loop = true,
    onEnded = null,
    onTimeUpdate = null,
    onLoadedMetadata = null,
  } = options;

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Play video
   */
  const play = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      await videoRef.current.play();
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      console.error('Play error:', err);
      setError('Failed to play video');
      setIsPlaying(false);
    }
  }, []);

  /**
   * Pause video
   */
  const pause = useCallback(() => {
    if (!videoRef.current) return;

    videoRef.current.pause();
    setIsPlaying(false);
  }, []);

  /**
   * Toggle play/pause
   */
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [isMuted]);

  /**
   * Seek to specific time
   */
  const seek = useCallback((time) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = time;
    setCurrentTime(time);
    setProgress((time / duration) * 100);
  }, [duration]);

  /**
   * Restart video
   */
  const restart = useCallback(() => {
    seek(0);
    play();
  }, [seek, play]);

  /**
   * Set volume (0-1)
   */
  const setVolume = useCallback((volume) => {
    if (!videoRef.current) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    videoRef.current.volume = clampedVolume;
  }, []);

  /**
   * Handle time update
   */
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;

    setCurrentTime(current);
    setProgress((current / total) * 100);

    if (onTimeUpdate) {
      onTimeUpdate(current, total);
    }
  }, [onTimeUpdate]);

  /**
   * Handle loaded metadata
   */
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;

    setDuration(videoRef.current.duration);
    setIsLoaded(true);

    if (onLoadedMetadata) {
      onLoadedMetadata(videoRef.current.duration);
    }
  }, [onLoadedMetadata]);

  /**
   * Handle video ended
   */
  const handleEnded = useCallback(() => {
    setIsPlaying(false);

    if (onEnded) {
      onEnded();
    }

    if (loop) {
      restart();
    }
  }, [loop, restart, onEnded]);

  /**
   * Handle video error
   */
  const handleError = useCallback((e) => {
    console.error('Video error:', e);
    setError('Failed to load video');
    setIsPlaying(false);
  }, []);

  /**
   * Set up event listeners
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Auto-play if enabled
    if (autoplay) {
      play();
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [autoplay, handleTimeUpdate, handleLoadedMetadata, handleEnded, handleError, play]);

  return {
    videoRef,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    progress,
    isLoaded,
    error,
    play,
    pause,
    togglePlay,
    toggleMute,
    seek,
    restart,
    setVolume,
  };
};