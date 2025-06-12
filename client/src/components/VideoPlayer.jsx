// import React, { useRef, useEffect, useState } from 'react';
// import { Play, Pause, Volume2, VolumeX, RotateCcw, BarChart3 } from 'lucide-react';

// const VideoPlayer = ({ courseData, onAnalyticsUpdate }) => {
//     const videoRef = useRef(null);

//     // Video player state
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [isMuted, setIsMuted] = useState(false);
//     const [currentTime, setCurrentTime] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [volume, setVolume] = useState(1);
//     const [showAnalytics, setShowAnalytics] = useState(false);
//     const [canPlay, setCanPlay] = useState(false);
//     const [videoError, setVideoError] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     // Analytics state
//     const [analytics, setAnalytics] = useState({
//         totalWatchTime: 0,
//         watchedSegments: [],
//         skipEvents: [],
//         pauseEvents: [],
//         volumeChanges: [],
//         seekEvents: [],
//         playbackRateChanges: [],
//         bufferingEvents: [],
//         watchPercentage: 0,
//         maxWatchedTime: 0,
//         sessionStart: null,
//         sessionEnd: null,
//         completionRate: 0
//     });

//     // Track last time update for calculating watch time
//     const lastTimeRef = useRef(0);
//     const sessionStartRef = useRef(null);
//     const bufferStartRef = useRef(null);

//     // Initialize analytics session
//     useEffect(() => {
//         if (courseData) {
//             const now = Date.now();
//             sessionStartRef.current = now;
//             setAnalytics(prev => ({
//                 ...prev,
//                 sessionStart: now
//             }));
//             logEvent('session_start', {
//                 timestamp: now,
//                 courseId: courseData.course.id,
//                 courseTitle: courseData.course.title
//             });
//         }
//     }, [courseData]);

//     // Update parent component with analytics
//     useEffect(() => {
//         if (onAnalyticsUpdate) {
//             onAnalyticsUpdate(analytics);
//         }
//     }, [analytics, onAnalyticsUpdate]);

//     // Video event handlers with analytics
//     const handlePlay = () => {
//         setIsPlaying(true);
//         logEvent('video_play', {
//             currentTime: videoRef.current?.currentTime || 0,
//             timestamp: Date.now(),
//             courseId: courseData?.course.id
//         });
//     };

//     const handlePause = () => {
//         setIsPlaying(false);
//         const currentTime = videoRef.current?.currentTime || 0;
//         const pauseData = {
//             currentTime,
//             timestamp: Date.now(),
//             courseId: courseData?.course.id
//         };

//         setAnalytics(prev => ({
//             ...prev,
//             pauseEvents: [...prev.pauseEvents, pauseData]
//         }));

//         logEvent('video_pause', pauseData);
//     };

//     const handleTimeUpdate = () => {
//         const video = videoRef.current;
//         if (!video) return;

//         const current = video.currentTime;
//         setCurrentTime(current);

//         // Calculate watch time increment
//         const timeIncrement = current - lastTimeRef.current;
//         if (timeIncrement > 0 && timeIncrement < 2) {
//             setAnalytics(prev => ({
//                 ...prev,
//                 totalWatchTime: prev.totalWatchTime + timeIncrement,
//                 maxWatchedTime: Math.max(prev.maxWatchedTime, current),
//                 watchPercentage: duration > 0 ? (current / duration) * 100 : 0
//             }));
//         }

//         lastTimeRef.current = current;
//     };

//     const handleSeeked = () => {
//         const video = videoRef.current;
//         if (!video) return;

//         const seekData = {
//             from: lastTimeRef.current,
//             to: video.currentTime,
//             timestamp: Date.now(),
//             courseId: courseData?.course.id
//         };

//         if (Math.abs(seekData.to - seekData.from) > 5) {
//             const skipData = {
//                 ...seekData,
//                 skippedDuration: Math.abs(seekData.to - seekData.from)
//             };

//             setAnalytics(prev => ({
//                 ...prev,
//                 skipEvents: [...prev.skipEvents, skipData]
//             }));

//             logEvent('video_skip', skipData);
//         } else {
//             setAnalytics(prev => ({
//                 ...prev,
//                 seekEvents: [...prev.seekEvents, seekData]
//             }));

//             logEvent('video_seek', seekData);
//         }

//         lastTimeRef.current = video.currentTime;
//     };

//     const handleVolumeChange = () => {
//         const video = videoRef.current;
//         if (!video) return;

//         const volumeData = {
//             volume: video.volume,
//             muted: video.muted,
//             timestamp: Date.now(),
//             courseId: courseData?.course.id
//         };

//         setVolume(video.volume);
//         setIsMuted(video.muted);

//         setAnalytics(prev => ({
//             ...prev,
//             volumeChanges: [...prev.volumeChanges, volumeData]
//         }));

//         logEvent('volume_change', volumeData);
//     };

//     const handleCanPlay = () => {
//         setCanPlay(true);
//         setVideoError(null);
//         setIsLoading(false);
//         console.log('Video can play');
//     };

//     const handleError = (e) => {
//         const video = e.target;
//         const error = video.error;
//         let errorMessage = 'Unknown video error';

//         if (error) {
//             switch (error.code) {
//                 case 1:
//                     errorMessage = 'Video loading was aborted by the user';
//                     break;
//                 case 2:
//                     errorMessage = 'Network error occurred while loading video (possibly CORS issue)';
//                     break;
//                 case 3:
//                     errorMessage = 'Video file is corrupted or cannot be decoded';
//                     break;
//                 case 4:
//                     errorMessage = 'Video format is not supported by your browser';
//                     break;
//                 default:
//                     errorMessage = `Video error: ${error.message || 'Unknown error'}`;
//             }
//         }

//         // Check if it's likely a CORS error
//         if (errorMessage.includes('Network error') || errorMessage.includes('CORS')) {
//             errorMessage += '. Try using a proxy endpoint or configure CORS on the server.';
//         }

//         setVideoError(errorMessage);
//         setCanPlay(false);
//         setIsLoading(false);
//         console.error('Video error:', errorMessage, error);

//         logEvent('video_error', {
//             error: errorMessage,
//             errorCode: error?.code,
//             timestamp: Date.now(),
//             courseId: courseData?.course.id
//         });
//     };

//     const handleWaiting = () => {
//         console.log('Video buffering...');
//         bufferStartRef.current = Date.now();
//         setIsLoading(true);
//     };

//     const handlePlaying = () => {
//         setIsLoading(false);
//         if (bufferStartRef.current) {
//             const bufferDuration = Date.now() - bufferStartRef.current;
//             setAnalytics(prev => ({
//                 ...prev,
//                 bufferingEvents: [...prev.bufferingEvents, {
//                     duration: bufferDuration,
//                     timestamp: Date.now(),
//                     courseId: courseData?.course.id
//                 }]
//             }));
//             bufferStartRef.current = null;
//         }
//         console.log('Video playing...');
//     };

//     const handleEnded = () => {
//         const endTime = Date.now();
//         const completionRate = duration > 0 ? (currentTime / duration) * 100 : 0;

//         setAnalytics(prev => ({
//             ...prev,
//             sessionEnd: endTime,
//             completionRate
//         }));

//         logEvent('video_ended', {
//             completionRate,
//             totalWatchTime: analytics.totalWatchTime,
//             sessionDuration: endTime - (sessionStartRef.current || endTime),
//             timestamp: endTime,
//             courseId: courseData?.course.id
//         });
//     };

//     const handleLoadedMetadata = () => {
//         const video = videoRef.current;
//         if (video && video.duration && !isNaN(video.duration)) {
//             setDuration(video.duration);
//             console.log('Video metadata loaded, duration:', video.duration);
//             logEvent('video_loaded', {
//                 duration: video.duration,
//                 timestamp: Date.now(),
//                 courseId: courseData?.course.id
//             });
//         }
//     };

//     const handleLoadStart = () => {
//         setIsLoading(true);
//         console.log('Video load started');
//     };

//     const handleLoadedData = () => {
//         console.log('Video data loaded');
//     };

//     const logEvent = (eventType, data) => {
//         console.log(`📊 VIDEO ANALYTICS - ${eventType.toUpperCase()}:`, {
//             eventType,
//             data,
//             course: courseData?.course.title
//         });
//     };

//     // Control functions
//     const togglePlay = async () => {
//         const video = videoRef.current;
//         if (!video || !canPlay || isLoading) {
//             console.log('Video not ready to play');
//             return;
//         }

//         try {
//             if (isPlaying) {
//                 await video.pause();
//             } else {
//                 const playPromise = video.play();
//                 if (playPromise !== undefined) {
//                     await playPromise;
//                 }
//             }
//         } catch (error) {
//             console.error('Error toggling play state:', error);
//             if (error.name === 'NotAllowedError') {
//                 setVideoError('Browser autoplay policy prevents automatic playback. Please click play manually.');
//             } else if (error.name === 'AbortError') {
//                 console.log('Play request was interrupted');
//             } else {
//                 setVideoError(`Playback error: ${error.message}`);
//             }
//         }
//     };

//     const toggleMute = () => {
//         const video = videoRef.current;
//         if (video && canPlay) {
//             video.muted = !video.muted;
//         }
//     };

//     const handleSeek = (e) => {
//         const video = videoRef.current;
//         if (!video || !canPlay || !duration) return;

//         const rect = e.currentTarget.getBoundingClientRect();
//         const percent = (e.clientX - rect.left) / rect.width;
//         const newTime = Math.max(0, Math.min(duration, percent * duration));

//         video.currentTime = newTime;
//     };

//     const resetVideo = () => {
//         const video = videoRef.current;
//         if (video && canPlay) {
//             video.currentTime = 0;
//             logEvent('video_reset', {
//                 timestamp: Date.now(),
//                 courseId: courseData?.course.id
//             });
//         }
//     };

//     const formatTime = (time) => {
//         if (!time || isNaN(time) || !isFinite(time)) return '0:00';
//         const minutes = Math.floor(time / 60);
//         const seconds = Math.floor(time % 60);
//         return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//     };

//     const getEngagementScore = () => {
//         if (duration === 0) return 0;
//         const watchRatio = analytics.totalWatchTime / duration;
//         const completionBonus = analytics.completionRate > 90 ? 0.2 : 0;
//         const skipPenalty = analytics.skipEvents.length * 0.05;
//         return Math.max(0, Math.min(100, (watchRatio * 100) + (completionBonus * 100) - (skipPenalty * 100)));
//     };

//     const getVideoUrl = () => {
//         if (!courseData?.course.video) return '';

//         let videoUrl = courseData.course.video;

//         // Handle different URL formats
//         if (videoUrl.startsWith('uploads/') || videoUrl.startsWith('/uploads/')) {
//             // Remove leading slash if present
//             const cleanPath = videoUrl.startsWith('/') ? videoUrl.substring(1) : videoUrl;

//             // Option 1: Try to create a proxy endpoint URL
//             // videoUrl = `/api/proxy/video?url=${encodeURIComponent(`${import.meta.env.VITE_API_URL}${cleanPath}`)}`;

//             // Option 2: Use the direct URL (may have CORS issues)
//             videoUrl = `${import.meta.env.VITE_API_URL}${cleanPath}`;

//             // Option 3: If you have a video proxy service
//             // videoUrl = `${import.meta.env.VITE_PROXY_URL}/${cleanPath}`;

//         } else if (!videoUrl.startsWith('http')) {
//             // If it's not a full URL, assume it's a relative path
//             videoUrl = `${import.meta.env.VITE_API_URL}${videoUrl}`;
//         }

//         console.log('Video URL:', videoUrl);
//         return videoUrl;
//     };

//     const videoUrl = getVideoUrl();

//     return (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="relative bg-black">
//                 {/* Video Error Display */}
//                 {videoError && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
//                         <div className="text-center text-white p-6 max-w-md">
//                             <div className="text-red-400 text-4xl mb-4">⚠️</div>
//                             <h3 className="text-lg font-semibold mb-2">Video Playback Error</h3>
//                             <p className="text-sm mb-4">{videoError}</p>
//                             <div className="space-y-2">
//                                 <button
//                                     onClick={() => {
//                                         setVideoError(null);
//                                         setCanPlay(false);
//                                         if (videoRef.current) {
//                                             videoRef.current.load();
//                                         }
//                                     }}
//                                     className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors block w-full"
//                                 >
//                                     Try Again
//                                 </button>
//                                 {videoError.includes('CORS') && (
//                                     <div className="text-xs text-yellow-300 mt-2 p-2 bg-yellow-900/30 rounded">
//                                         <strong>CORS Issue Detected:</strong><br />
//                                         Contact your backend developer to add CORS headers or set up a video proxy endpoint.
//                                     </div>
//                                 )}
//                             </div>
//                             <p className="text-xs mt-3 text-gray-300 break-all">URL: {videoUrl}</p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Loading indicator */}
//                 {(isLoading || (!canPlay && !videoError && videoUrl)) && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
//                         <div className="text-center text-white">
//                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//                             <p>Loading video...</p>
//                         </div>
//                     </div>
//                 )}

//                 {/* No video available */}
//                 {!videoUrl && (
//                     <div className="aspect-video flex items-center justify-center bg-gray-800">
//                         <div className="text-center text-gray-400">
//                             <div className="text-4xl mb-4">📹</div>
//                             <p>No video available for this course</p>
//                         </div>
//                     </div>
//                 )}

//                 {videoUrl && (
//                     <video
//                         ref={videoRef}
//                         className="w-full aspect-video"
//                     // onPlay={handlePlay}
//                     // onPause={handlePause}
//                     // onTimeUpdate={handleTimeUpdate}
//                     // onSeeked={handleSeeked}
//                     // onVolumeChange={handleVolumeChange}
//                     // onEnded={handleEnded}
//                     // onLoadedMetadata={handleLoadedMetadata}
//                     // onCanPlay={handleCanPlay}
//                     // onError={handleError}
//                     // onWaiting={handleWaiting}
//                     // onPlaying={handlePlaying}
//                     // onLoadStart={handleLoadStart}
//                     // onLoadedData={handleLoadedData}
//                     // preload="metadata"
//                     // controls={false}
//                     // Remove crossOrigin since it's causing CORS issues
//                     // crossOrigin="anonymous"
//                     >
//                         {/* <source src={videoUrl} type="video/mp4" />
//                         <source src={videoUrl} type="video/webm" />
//                         <source src={videoUrl} type="video/ogg" />
//                         Your browser does not support the video tag. */}
//                     </video>
//                 )}

//                 {/* Custom Controls */}
//                 {videoUrl && (
//                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
//                         {/* Progress Bar */}
//                         <div
//                             className="w-full h-2 bg-gray-600 rounded cursor-pointer mb-3 hover:h-3 transition-all"
//                             onClick={handleSeek}
//                         >
//                             <div
//                                 className="h-full bg-blue-500 rounded transition-all duration-200"
//                                 style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
//                             />
//                         </div>

//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-4">
//                                 <button
//                                     onClick={togglePlay}
//                                     disabled={!canPlay || isLoading}
//                                     className={`p-2 hover:bg-white/20 rounded transition-colors ${(!canPlay || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                 >
//                                     {isPlaying ? <Pause size={20} /> : <Play size={20} />}
//                                 </button>

//                                 <button
//                                     onClick={toggleMute}
//                                     disabled={!canPlay}
//                                     className={`p-2 hover:bg-white/20 rounded transition-colors ${!canPlay ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                 >
//                                     {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
//                                 </button>

//                                 <span className="text-sm font-medium">
//                                     {formatTime(currentTime)} / {formatTime(duration)}
//                                 </span>
//                             </div>

//                             <div className="flex items-center space-x-2">
//                                 <button
//                                     onClick={resetVideo}
//                                     disabled={!canPlay}
//                                     className={`p-2 hover:bg-white/20 rounded transition-colors ${!canPlay ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                     title="Reset Video"
//                                 >
//                                     <RotateCcw size={16} />
//                                 </button>

//                                 <button
//                                     onClick={() => setShowAnalytics(!showAnalytics)}
//                                     className={`p-2 hover:bg-white/20 rounded transition-colors ${showAnalytics ? 'bg-white/20' : ''}`}
//                                     title="Toggle Analytics"
//                                 >
//                                     <BarChart3 size={16} />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Analytics Dashboard */}
//             {showAnalytics && (
//                 <div className="p-6 bg-gray-50">
//                     <h3 className="text-lg font-semibold mb-4">Learning Analytics</h3>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                         <div className="bg-white p-4 rounded-lg border">
//                             <h4 className="font-medium text-green-600 mb-1">Watch Time</h4>
//                             <p className="text-2xl font-bold">{formatTime(analytics.totalWatchTime)}</p>
//                             <p className="text-sm text-gray-500">
//                                 {analytics.watchPercentage.toFixed(1)}% watched
//                             </p>
//                         </div>

//                         <div className="bg-white p-4 rounded-lg border">
//                             <h4 className="font-medium text-blue-600 mb-1">Engagement</h4>
//                             <p className="text-2xl font-bold">{getEngagementScore().toFixed(1)}%</p>
//                             <p className="text-sm text-gray-500">Engagement score</p>
//                         </div>

//                         <div className="bg-white p-4 rounded-lg border">
//                             <h4 className="font-medium text-yellow-600 mb-1">Skip Events</h4>
//                             <p className="text-2xl font-bold">{analytics.skipEvents.length}</p>
//                             <p className="text-sm text-gray-500">Forward skips</p>
//                         </div>

//                         <div className="bg-white p-4 rounded-lg border">
//                             <h4 className="font-medium text-purple-600 mb-1">Pauses</h4>
//                             <p className="text-2xl font-bold">{analytics.pauseEvents.length}</p>
//                             <p className="text-sm text-gray-500">Times paused</p>
//                         </div>

//                         <div className="bg-white p-4 rounded-lg border">
//                             <h4 className="font-medium text-red-600 mb-1">Completion</h4>
//                             <p className="text-2xl font-bold">{analytics.completionRate.toFixed(1)}%</p>
//                             <p className="text-sm text-gray-500">Video completion</p>
//                         </div>

//                         <div className="bg-white p-4 rounded-lg border">
//                             <h4 className="font-medium text-indigo-600 mb-1">Progress</h4>
//                             <p className="text-2xl font-bold">{formatTime(analytics.maxWatchedTime)}</p>
//                             <p className="text-sm text-gray-500">Max watched time</p>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default VideoPlayer;
import React, { useRef, useState, useCallback } from 'react'
import ReactPlayer from 'react-player'

const VideoPlayerTracker = () => {
  const playerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lastSeekTime, setLastSeekTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [logs, setLogs] = useState([])

  // Sample course data - replace with your actual data
  const courseData = {
    course: {
      id: 7,
      instructor_id: 8,
      title: "Laravel Basics",
      video: "uploads/courses/videos/1749703477.mp4",
      instructor: {
        name: "John Doe"
      }
    },
    timestamp: null
  }

  const baseUrl = "http://192.168.13.127:8000/"
  const videoUrl = `${baseUrl}${courseData.course.video}`

  // Logging function
  const logActivity = useCallback((activity, data = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      activity,
      courseId: courseData.course.id,
      currentTime: Math.round(currentTime),
      duration: Math.round(duration),
      ...data
    }
    
    setLogs(prev => [...prev, logEntry])
    console.log('Video Activity:', logEntry)
    
    // Here you would typically send this data to your backend
    // sendToBackend(logEntry)
  }, [courseData.course.id, currentTime, duration])

  // Event handlers
  const handlePlay = () => {
    setIsPlaying(true)
    logActivity('RESUMED', {
      resumedAt: new Date().toISOString()
    })
  }

  const handlePause = () => {
    setIsPlaying(false)
    logActivity('PAUSED', {
      pausedAt: new Date().toISOString()
    })
  }

  const handleSeek = (seconds) => {
    const timeDiff = Math.abs(seconds - lastSeekTime)
    
    // If time difference is more than 2 seconds, consider it a seek/skip
    if (timeDiff > 2) {
      if (seconds > lastSeekTime) {
        logActivity('SKIPPED_FORWARD', {
          skippedFrom: Math.round(lastSeekTime),
          skippedTo: Math.round(seconds),
          skippedDuration: Math.round(timeDiff)
        })
      } else {
        logActivity('SEEKED_BACKWARD', {
          skippedFrom: Math.round(lastSeekTime),
          skippedTo: Math.round(seconds),
          skippedDuration: Math.round(timeDiff)
        })
      }
    }
    
    setLastSeekTime(seconds)
  }

  const handleProgress = ({ played, playedSeconds, loaded, loadedSeconds }) => {
    setCurrentTime(playedSeconds)
    
    // Auto-save progress every 30 seconds of playback
    if (Math.floor(playedSeconds) % 30 === 0 && Math.floor(playedSeconds) !== Math.floor(lastSeekTime)) {
      logActivity('PROGRESS_UPDATE', {
        progressPercent: Math.round(played * 100),
        playedSeconds: Math.round(playedSeconds),
        loadedPercent: Math.round(loaded * 100)
      })
    }
  }

  const handleDuration = (duration) => {
    setDuration(duration)
    logActivity('VIDEO_LOADED', {
      videoDuration: Math.round(duration)
    })
  }

  const handleEnded = () => {
    logActivity('COMPLETED', {
      completedAt: new Date().toISOString(),
      watchTimePercent: 100
    })
  }

  const handleError = (error) => {
    logActivity('ERROR', {
      error: error.toString(),
      errorAt: new Date().toISOString()
    })
  }

  const handleStart = () => {
    logActivity('STARTED', {
      startedAt: new Date().toISOString()
    })
  }

  const clearLogs = () => {
    setLogs([])
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {courseData.course.title}
        </h2>
        <p className="text-gray-600">
          Instructor: {courseData.course.instructor.name}
        </p>
      </div>

      <div className="mb-6 bg-black rounded-lg overflow-hidden">
        <ReactPlayer
        //   ref={playerRef}
          url={videoUrl}
          controls
          width="100%"
          height="400px"
          onPlay={handlePlay}
          onPause={handlePause}
          onSeek={handleSeek}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleEnded}
          onError={handleError}
          onStart={handleStart}
          config={{
            file: {
              attributes: {
                crossOrigin: 'anonymous'
              }
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Stats */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Video Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${isPlaying ? 'text-green-600' : 'text-red-600'}`}>
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Time:</span>
              <span className="font-medium">{formatTime(currentTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{formatTime(duration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Progress:</span>
              <span className="font-medium">
                {duration > 0 ? Math.round((currentTime / duration) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Activity Logs</h3>
            <button
              onClick={clearLogs}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="h-64 overflow-y-auto space-y-2">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No activity yet</p>
            ) : (
              logs.slice(-10).reverse().map((log, index) => (
                <div key={index} className="bg-white p-2 rounded border text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-medium px-2 py-1 rounded text-xs ${
                      log.activity === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      log.activity === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                      log.activity === 'RESUMED' ? 'bg-blue-100 text-blue-800' :
                      log.activity.includes('SKIP') || log.activity.includes('SEEK') ? 'bg-purple-100 text-purple-800' :
                      log.activity === 'ERROR' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.activity}
                    </span>
                    <span className="text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Time: {formatTime(log.currentTime)}
                    {log.skippedFrom !== undefined && (
                      <span> | From: {formatTime(log.skippedFrom)} → To: {formatTime(log.skippedTo)}</span>
                    )}
                    {log.progressPercent !== undefined && (
                      <span> | Progress: {log.progressPercent}%</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold mb-2">Debug Info</h4>
        <p className="text-sm text-gray-600">
          Video URL: {videoUrl}
        </p>
        <p className="text-sm text-gray-600">
          Course ID: {courseData.course.id}
        </p>
        <p className="text-sm text-gray-600">
          Total Logs: {logs.length}
        </p>
      </div>
    </div>
  )
}

export default VideoPlayerTracker
