import { useEffect, useState } from "react";
import { CheckCircle, Play, Video } from "lucide-react";
import api from "../../axios.js";
import { toast } from "react-toastify";
import { href, Link, useLocation, useNavigate } from "react-router-dom";

// import {Navite}
const Tutorials = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchingTutorial, setWatchingTutorial] = useState(null);
  const [watchProgress, setWatchProgress] = useState({});
  const navigate = useNavigate()
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await api.get("/api/user/courses");
        setCourses(res.data?.data || []);
        console.log(res.data.data);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const startWatching = (course) => {
   console.log(course.id)
   navigate(`/user/tutorials/${course.course.id}`)
  };

  const updateProgress = (courseId, progress) => {
    setWatchProgress({
      ...watchProgress,
      [courseId]: progress
    });
  };

  // Helper function to calculate watched time from timestamp
  const getWatchedMinutes = (timestamp) => {
    if (!timestamp || !timestamp.completed_at || !timestamp.paused_at) return 0;

    const pausedAt = new Date(timestamp.paused_at);
    const completedAt = new Date(timestamp.completed_at);
    const resumedAt = timestamp.resumed_at ? new Date(timestamp.resumed_at) : pausedAt;

    // Calculate total watched time (this is a simplified calculation)
    const watchedMs = completedAt - pausedAt + (completedAt - resumedAt);
    return Math.floor(watchedMs / (1000 * 60)); // Convert to minutes
  };

  // Helper function to get course status
  const getCourseStatus = (course) => {
    if (!course.enrolled) return 'Not Started';
    if (course.timestamp?.completed_at) return 'Completed';
    if (course.timestamp?.paused_at) return 'In Progress';
    return 'Not Started';
  };

  // Helper function to get MMR reward (placeholder calculation)
  const getMmrReward = (price) => {
    // Simple calculation based on price - you can adjust this logic
    const numPrice = parseFloat(price);
    return Math.floor(numPrice / 10);
  };

  // Helper function to get estimated duration (placeholder)
  const getEstimatedDuration = () => {
    // Since duration isn't in the API, using a placeholder
    // You might want to add this to your API or calculate based on video length
    return Math.floor(Math.random() * 60) + 30; // 30-90 minutes
  };

  const getProgressColor = (watched, duration) => {
    const percentage = (watched / duration) * 100;
    if (percentage === 100) return 'bg-green-500';
    if (percentage > 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span>;
      case 'In Progress':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">In Progress</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Not Started</span>;
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

  const esewaCall = (formData) => {
    console.log(formData);
    const path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    for (const key in formData) {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", formData[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
  };
  async function handleEnroll(enrollData) {

    const formdata = new FormData();
    console.log(enrollData)
    console.log({
      course_id: enrollData?.course?.id

    })
    formdata.append("course_id", enrollData?.course?.id)
    // formdata.append("course_id", enrollData.id)
    const data = await api.post("api/course-enrollments", formdata)

    if (data.data.success) {
      esewaCall(data.data.data.from_data);

    }
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
          {courses.map(courseData => {
            const course = courseData.course;
            const status = getCourseStatus(courseData);
            const duration = getEstimatedDuration(); // You'll want to get this from API
            const currentProgress = watchProgress[course.id] || getWatchedMinutes(courseData.timestamp);
            const progressPercentage = (currentProgress / duration) * 100;
            const mmrReward = getMmrReward(course.price);

            return (
              <div key={course.id} className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm">Instructor: {course.instructor.name}</p>
                  <p className="text-gray-600 text-sm">Price: ${course.price}</p>
                  <p className="text-gray-500 text-xs mt-1">{course.description}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(currentProgress, duration)}`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {currentProgress} / {duration} minutes watched
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">MMR Reward:</span>
                    <span className="text-sm font-medium text-green-600">+{mmrReward}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status:</span>
                    {getStatusBadge(status)}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Enrolled:</span>
                    <span className={`text-sm ${courseData.enrolled ? 'text-green-600' : 'text-red-600'}`}>
                      {courseData.enrolled ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {!courseData.enrolled ? (
                    <button className="w-full bg-gray-400 text-white py-2 rounded-lg " onClick={() => handleEnroll(courseData)}>
                      Enroll First
                    </button>
                  ) : status !== 'Completed' ? (
                    <button
                      onClick={() => startWatching(courseData)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
                    >
                      <Play size={16} />
                      <span>{status === 'Not Started' ? 'Start Tutorial' : 'Continue'}</span>
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
                    {Math.round((watchProgress[watchingTutorial.course.id] ||
                      getWatchedMinutes(watchingTutorial.timestamp)) /
                      getEstimatedDuration() * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={getEstimatedDuration()}
                  value={watchProgress[watchingTutorial.course.id] ||
                    getWatchedMinutes(watchingTutorial.timestamp)}
                  onChange={(e) => updateProgress(watchingTutorial.course.id, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0:00</span>
                  <span>
                    {Math.floor(getEstimatedDuration() / 60)}:
                    {(getEstimatedDuration() % 60).toString().padStart(2, '0')}
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