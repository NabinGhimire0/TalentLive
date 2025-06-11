import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, BarChart3 } from 'lucide-react';

const VideoAnalyticsTracker = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalWatchTime: 0,
    watchedSegments: [],
    skipEvents: [],
    pauseEvents: [],
    volumeChanges: [],
    seekEvents: [],
    playbackRateChanges: [],
    bufferingEvents: [],
    watchPercentage: 0,
    maxWatchedTime: 0,
    sessionStart: null,
    sessionEnd: null,
    completionRate: 0
  });

  // Track last time update for calculating watch time
  const lastTimeRef = useRef(0);
  const sessionStartRef = useRef(null);
  const bufferStartRef = useRef(null);

  // Initialize session
  useEffect(() => {
    const now = Date.now();
    sessionStartRef.current = now;
    setAnalytics(prev => ({
      ...prev,
      sessionStart: now
    }));
    logEvent('session_start', { timestamp: now });
  }, []);

  // Video event handlers with analytics
  const handlePlay = () => {
    setIsPlaying(true);
    logEvent('video_play', {
      currentTime: videoRef.current?.currentTime || 0,
      timestamp: Date.now()
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
    const currentTime = videoRef.current?.currentTime || 0;
    const pauseData = {
      currentTime,
      timestamp: Date.now()
    };
    
    setAnalytics(prev => ({
      ...prev,
      pauseEvents: [...prev.pauseEvents, pauseData]
    }));
    
    logEvent('video_pause', pauseData);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const current = video.currentTime;
    setCurrentTime(current);

    // Calculate watch time increment
    const timeIncrement = current - lastTimeRef.current;
    if (timeIncrement > 0 && timeIncrement < 2) { // Prevent large jumps from seeking
      setAnalytics(prev => ({
        ...prev,
        totalWatchTime: prev.totalWatchTime + timeIncrement,
        maxWatchedTime: Math.max(prev.maxWatchedTime, current),
        watchPercentage: duration > 0 ? (current / duration) * 100 : 0
      }));
    }

    lastTimeRef.current = current;
  };

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;

    const seekData = {
      from: lastTimeRef.current,
      to: video.currentTime,
      timestamp: Date.now()
    };

    // Detect if this was a skip (forward seek > 5 seconds)
    if (seekData.to - seekData.from > 5) {
      const skipData = {
        ...seekData,
        skippedDuration: seekData.to - seekData.from
      };
      
      setAnalytics(prev => ({
        ...prev,
        skipEvents: [...prev.skipEvents, skipData]
      }));
      
      logEvent('video_skip', skipData);
    } else {
      setAnalytics(prev => ({
        ...prev,
        seekEvents: [...prev.seekEvents, seekData]
      }));
      
      logEvent('video_seek', seekData);
    }

    lastTimeRef.current = video.currentTime;
  };

  const handleVolumeChange = () => {
    const video = videoRef.current;
    if (!video) return;

    const volumeData = {
      volume: video.volume,
      muted: video.muted,
      timestamp: Date.now()
    };

    setVolume(video.volume);
    setIsMuted(video.muted);
    
    setAnalytics(prev => ({
      ...prev,
      volumeChanges: [...prev.volumeChanges, volumeData]
    }));

    logEvent('volume_change', volumeData);
  };

  const handleRateChange = () => {
    const video = videoRef.current;
    if (!video) return;

    const rateData = {
      playbackRate: video.playbackRate,
      timestamp: Date.now()
    };

    setAnalytics(prev => ({
      ...prev,
      playbackRateChanges: [...prev.playbackRateChanges, rateData]
    }));

    logEvent('playback_rate_change', rateData);
  };

  const handleWaiting = () => {
    bufferStartRef.current = Date.now();
    logEvent('buffering_start', {
      currentTime: videoRef.current?.currentTime || 0,
      timestamp: Date.now()
    });
  };

  const handleCanPlay = () => {
    if (bufferStartRef.current) {
      const bufferData = {
        duration: Date.now() - bufferStartRef.current,
        currentTime: videoRef.current?.currentTime || 0,
        timestamp: Date.now()
      };

      setAnalytics(prev => ({
        ...prev,
        bufferingEvents: [...prev.bufferingEvents, bufferData]
      }));

      logEvent('buffering_end', bufferData);
      bufferStartRef.current = null;
    }
  };

  const handleEnded = () => {
    const endTime = Date.now();
    const completionRate = duration > 0 ? (currentTime / duration) * 100 : 0;
    
    setAnalytics(prev => ({
      ...prev,
      sessionEnd: endTime,
      completionRate
    }));

    logEvent('video_ended', {
      completionRate,
      totalWatchTime: analytics.totalWatchTime,
      sessionDuration: endTime - sessionStartRef.current,
      timestamp: endTime
    });
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
      logEvent('video_loaded', {
        duration: video.duration,
        timestamp: Date.now()
      });
    }
  };

  // Logging function
  const logEvent = (eventType, data) => {
    console.log(`📊 VIDEO ANALYTICS - ${eventType.toUpperCase()}:`, {
      eventType,
      data,
      videoSrc: './video.mp4'
    });
  };

  // Control functions
  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    if (video) {
      video.currentTime = newTime;
    }
  };

  const resetVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      logEvent('video_reset', { timestamp: Date.now() });
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getEngagementScore = () => {
    if (duration === 0) return 0;
    const watchRatio = analytics.totalWatchTime / duration;
    const completionBonus = analytics.completionRate > 90 ? 0.2 : 0;
    const skipPenalty = analytics.skipEvents.length * 0.05;
    return Math.max(0, Math.min(100, (watchRatio * 100) + (completionBonus * 100) - (skipPenalty * 100)));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Video Analytics Tracker</h2>
      
      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-4">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onSeeked={handleSeeked}
          onVolumeChange={handleVolumeChange}
          onRateChange={handleRateChange}
          onWaiting={handleWaiting}
          onCanPlay={handleCanPlay}
          onEnded={handleEnded}
          onLoadedMetadata={handleLoadedMetadata}
          preload="metadata"
        >
          <source src="video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-gray-600 rounded cursor-pointer mb-3"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-red-500 rounded"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white/20 rounded"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/20 rounded"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={resetVideo}
                className="p-2 hover:bg-white/20 rounded"
                title="Reset Video"
              >
                <RotateCcw size={16} />
              </button>
              
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="p-2 hover:bg-white/20 rounded"
                title="Toggle Analytics"
              >
                <BarChart3 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-green-400 mb-2">Watch Time</h3>
            <p className="text-2xl">{formatTime(analytics.totalWatchTime)}</p>
            <p className="text-sm text-gray-400">
              {analytics.watchPercentage.toFixed(1)}% watched
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-blue-400 mb-2">Engagement Score</h3>
            <p className="text-2xl">{getEngagementScore().toFixed(1)}%</p>
            <p className="text-sm text-gray-400">Overall engagement</p>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-yellow-400 mb-2">Skip Events</h3>
            <p className="text-2xl">{analytics.skipEvents.length}</p>
            <p className="text-sm text-gray-400">Forward skips detected</p>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-purple-400 mb-2">Pause Events</h3>
            <p className="text-2xl">{analytics.pauseEvents.length}</p>
            <p className="text-sm text-gray-400">Times paused</p>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-red-400 mb-2">Completion Rate</h3>
            <p className="text-2xl">{analytics.completionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-400">Video completion</p>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-indigo-400 mb-2">Buffer Events</h3>
            <p className="text-2xl">{analytics.bufferingEvents.length}</p>
            <p className="text-sm text-gray-400">Buffering incidents</p>
          </div>
        </div>
      )}

      {/* Event Log Instructions */}
      <div className="bg-gray-800 p-4 rounded">
        <h3 className="font-semibold mb-2">📊 Analytics Logging</h3>
        <p className="text-sm text-gray-300 mb-2">
          All events are logged to the browser console. Open Developer Tools (F12) to see detailed analytics.
        </p>
        <div className="text-xs text-gray-400">
          <strong>Tracked Events:</strong> play, pause, seek, skip, volume changes, buffering, completion, and more
        </div>
      </div>
    </div>
  );
};

export default VideoAnalyticsTracker;