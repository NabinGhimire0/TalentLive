import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Clock, Users, Calendar, BookOpen } from 'lucide-react';
import api from '../../axios';
import VideoPlayer from '../../components/VideoPlayer';

const WatchVideos = () => {
    const { id } = useParams();

    // Course data state
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Analytics state from video player
    const [videoAnalytics, setVideoAnalytics] = useState(null);

    // Fetch course data
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get(`api/user/courses/${id}`);

                if (response.data.success) {
                    setCourseData(response.data.data);
                } else {
                    setError('Failed to load course data');
                }
            } catch (err) {
                setError('Failed to fetch course data');
                console.error('Error fetching course:', err);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchData();
        }
    }, [id]);

    // Handle analytics updates from video player
    const handleAnalyticsUpdate = (analytics) => {
        setVideoAnalytics(analytics);
    };

    // Utility functions
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        if (!time || isNaN(time) || !isFinite(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getEngagementScore = () => {
        if (!videoAnalytics || !videoAnalytics.totalWatchTime) return 0;
        
        // Simple engagement calculation based on available data
        const watchRatio = videoAnalytics.watchPercentage / 100;
        const completionBonus = videoAnalytics.completionRate > 90 ? 0.2 : 0;
        const skipPenalty = videoAnalytics.skipEvents.length * 0.05;
        
        return Math.max(0, Math.min(100, (watchRatio * 100) + (completionBonus * 100) - (skipPenalty * 100)));
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading course...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Course</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // No data state
    if (!courseData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <p className="text-gray-600">No course data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Course Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                                {courseData.course.title}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {courseData.course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <User size={16} />
                                    <span>{courseData.course.instructor.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    <span>Created {formatDate(courseData.course.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users size={16} />
                                    <span>{courseData.course.enrollments.length} enrolled</span>
                                </div>
                                {courseData.course.price === "0.00" && (
                                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                        Free Course
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 lg:mt-0 lg:ml-6">
                            <div className="bg-gray-100 rounded-lg p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        ${courseData.course.price}
                                    </div>
                                    <div className="text-sm text-gray-500">Course Price</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Player Section */}
                    <div className="lg:col-span-2">
                        <VideoPlayer 
                            courseData={courseData} 
                            onAnalyticsUpdate={handleAnalyticsUpdate}
                        />
                    </div>

                    {/* Course Info Sidebar */}
                    <div className="space-y-6">
                        {/* Instructor Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Instructor</h3>
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User size={24} className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 capitalize">
                                        {courseData.course.instructor.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {courseData.course.instructor.role}
                                    </p>
                                    {courseData.course.instructor.bio && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            {courseData.course.instructor.bio}
                                        </p>
                                    )}
                                    <div className="text-xs text-gray-500">
                                        📍 {courseData.course.instructor.location}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Stats */}
                         <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Course Stats</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-center gap-2">
                                    <Clock size={16} className="text-blue-600" />
                                    Total Duration: {formatTime(courseData.totalDuration || 0)}
                                </li>
                                <li className="flex items-center gap-2">
                                    <BookOpen size={16} className="text-green-600" />
                                    Total Lectures: {courseData.videos?.length || 0}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Users size={16} className="text-purple-600" />
                                    Enrolled Students: {courseData.course.enrollments.length}
                                </li>
                                <li className="flex items-center gap-2">
                                    <User size={16} className="text-gray-600" />
                                    Instructor: {courseData.course.instructor.name}
                                </li>
                                {videoAnalytics && (
                                    <>
                                        <li className="flex items-center gap-2">
                                            <Clock size={16} className="text-orange-500" />
                                            Watch Time: {formatTime(videoAnalytics.totalWatchTime)}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-yellow-600 font-bold text-sm">⚡</span>
                                            Engagement Score: {getEngagementScore().toFixed(1)} / 100
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchVideos;