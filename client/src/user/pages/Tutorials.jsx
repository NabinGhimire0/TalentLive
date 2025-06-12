import { useEffect, useState } from "react";
import { CheckCircle, Play, Video } from "lucide-react";
import api from "../../axios.js";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const Tutorials = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [watchingTutorial, setWatchingTutorial] = useState(null);
    const [watchProgress, setWatchProgress] = useState({});
    const [enrollingCourseId, setEnrollingCourseId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const res = await api.get("/api/user/courses");
                setCourses(res.data?.data || []);
                console.log("Fetched courses:", res.data.data);

                // Check for payment query parameters
                const query = new URLSearchParams(location.search);
                if (query.get("payment") === "failed") {
                    toast.error("Payment failed or was cancelled");
                } else if (query.get("payment") === "success") {
                    toast.success("Enrollment successful!");
                }
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error(error.response?.data?.message || "Failed to load courses");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [location.search]);

    const startWatching = (course) => {
        console.log("Starting course:", course.id);
        navigate(`/user/tutorials/${course.course.id}`);
    };

    const updateProgress = (courseId, progress) => {
        setWatchProgress({
            ...watchProgress,
            [courseId]: progress,
        });
    };

    const getWatchedMinutes = (timestamp) => {
        if (!timestamp || !timestamp.completed_at || !timestamp.paused_at) return 0;
        const pausedAt = new Date(timestamp.paused_at);
        const completedAt = new Date(timestamp.completed_at);
        const resumedAt = timestamp.resumed_at ? new Date(timestamp.resumed_at) : pausedAt;
        const watchedMs = completedAt - pausedAt + (completedAt - resumedAt);
        return Math.floor(watchedMs / (1000 * 60));
    };

    const getCourseStatus = (course) => {
        if (!course.enrolled) return "Not Started";
        if (course.timestamp?.completed_at) return "Completed";
        if (course.timestamp?.paused_at) return "In Progress";
        return "Not Started";
    };

    const getMmrReward = (price) => {
        const numPrice = parseFloat(price);
        return Math.floor(numPrice / 10);
    };

    const getEstimatedDuration = () => {
        return Math.floor(Math.random() * 60) + 30;
    };

    const getProgressColor = (watched, duration) => {
        const percentage = (watched / duration) * 100;
        if (percentage === 100) return "bg-green-500";
        if (percentage > 50) return "bg-blue-500";
        return "bg-yellow-500";
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Completed":
                return (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Completed
                    </span>
                );
            case "In Progress":
                return (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        In Progress
                    </span>
                );
            default:
                return (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                        Not Started
                    </span>
                );
        }
    };

    const esewaCall = (formData) => {
        console.log("eSewa form data:", formData);
        const paymentUrl = formData.payment_url;
        const data = formData.form_data;

        if (!paymentUrl || !data) {
            console.error("Invalid payment URL or form data");
            toast.error("Payment initiation failed");
            return;
        }

        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", paymentUrl);

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", data[key]);
                form.appendChild(hiddenField);
                console.log(`Adding form field: ${key}=${data[key]}`);
            }
        }

        document.body.appendChild(form);
        console.log("Submitting form to:", paymentUrl);
        try {
            setTimeout(() => {
                form.submit();
            }, 100); // Small delay to ensure DOM update
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("Failed to redirect to payment gateway");
        }
    };

    const handleEnroll = async (enrollData) => {
        try {
            setEnrollingCourseId(enrollData.course.id);
            const formData = new FormData();
            formData.append("course_id", enrollData?.course?.id);

            const res = await api.post("/api/course-enrollments", formData);
            console.log("Enrollment response:", res.data);

            if (res.data.success) {
                esewaCall(res.data.data);
            } else {
                toast.error(`Enrollment failed: ${res.data.message}`);
            }
        } catch (error) {
            console.error("Enrollment error:", error);
            toast.error(error.response?.data?.message || "Something went wrong during enrollment");
        } finally {
            setEnrollingCourseId(null);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading courses...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Learning Tutorials</h2>
                <div className="text-sm text-gray-600">
                    Complete tutorials to earn MMR based on watch progress
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">No courses available</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((courseData) => {
                        const course = courseData.course;
                        const status = getCourseStatus(courseData);
                        const duration = getEstimatedDuration();
                        const currentProgress =
                            watchProgress[course.id] || getWatchedMinutes(courseData.timestamp);
                        const progressPercentage = (currentProgress / duration) * 100;
                        const mmrReward = getMmrReward(course.price);

                        return (
                            <div key={course.id} className="bg-white p-6 rounded-lg shadow">
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                                    <p className="text-gray-600 text-sm">
                                        Instructor: {course.instructor?.name || "Unknown"}
                                    </p>
                                    <p className="text-gray-600 text-sm">Price: ${course.price}</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {course.description || "No description available"}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Progress</span>
                                            <span>{Math.round(progressPercentage)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${getProgressColor(
                                                    currentProgress,
                                                    duration
                                                )}`}
                                                style={{ width: `${progressPercentage}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {currentProgress} / {duration} minutes watched
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">MMR Reward:</span>
                                        <span className="text-sm font-medium text-green-600">
                                            +{mmrReward}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Status:</span>
                                        {getStatusBadge(status)}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Enrolled:</span>
                                        <span
                                            className={`text-sm ${
                                                courseData.enrolled
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {courseData.enrolled ? "Yes" : "No"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    {!courseData.enrolled ? (
                                        <button
                                            className="w-full bg-gray-400 text-white py-2 rounded-lg flex justify-center items-center disabled:bg-gray-600"
                                            onClick={() => handleEnroll(courseData)}
                                            disabled={enrollingCourseId === course.id}
                                        >
                                            {enrollingCourseId === course.id
                                                ? "Processing..."
                                                : "Enroll First"}
                                        </button>
                                    ) : status !== "Completed" ? (
                                        <button
                                            onClick={() => startWatching(courseData)}
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
                                        >
                                            <Play size={16} />
                                            <span>
                                                {status === "Not Started"
                                                    ? "Start Tutorial"
                                                    : "Continue"}
                                            </span>
                                        </button>
                                    ) : (
                                        <button className="w-full bg-green-100 text-green-800 py-2 rounded-lg flex items-center justify-center space-x-2">
                                            <CheckCircle size={16} />
                                            <span>Completed</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {watchingTutorial && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Watching: {watchingTutorial.course.title}
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-gray-900 h-48 rounded-lg flex items-center justify-center">
                                {watchingTutorial.course.video ? (
                                    <video
                                        controls
                                        className="w-full h-full rounded-lg"
                                        src={watchingTutorial.course.video}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <Video className="text-white" size={48} />
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Progress</span>
                                    <span>
                                        {Math.round(
                                            ((watchProgress[watchingTutorial.course.id] ||
                                                getWatchedMinutes(watchingTutorial.timestamp)) /
                                                getEstimatedDuration()) *
                                                100
                                        )}
                                        %
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={getEstimatedDuration()}
                                    value={
                                        watchProgress[watchingTutorial.course.id] ||
                                        getWatchedMinutes(watchingTutorial.timestamp)
                                    }
                                    onChange={(e) =>
                                        updateProgress(
                                            watchingTutorial.course.id,
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0:00</span>
                                    <span>
                                        {Math.floor(getEstimatedDuration() / 60)}:
                                        {(getEstimatedDuration() % 60)
                                            .toString()
                                            .padStart(2, "0")}
                                    </span>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600">
                                <p>MMR will be calculated based on actual watch time.</p>
                                <p>Seeking reduces MMR gain by 50%.</p>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setWatchingTutorial(null)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tutorials;