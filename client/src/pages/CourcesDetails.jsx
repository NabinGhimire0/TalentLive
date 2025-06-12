import React, { useEffect, useState } from 'react';
import api from '../axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const res = await api.get(`api/frontend/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.data);
        } else {
          setError('Course not found');
        }
      } catch (error) {
        setError(error.message || 'Something went wrong');
        toast.error(error.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return (

      <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
            <p className="mt-4 text-gray-600">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 font-medium">{error || 'Course not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden">
      <NavBar />
     
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .skill-badge {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          transition: all 0.3s ease;
        }
        
        .skill-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
        }
        
        .floating-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        .card-hover {
          transition: all 0.4s ease;
          transform: translateY(0);
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 floating-animation" style={{top: '15%', left: '10%'}}></div>
        <div className="absolute w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 floating-animation" style={{top: '70%', right: '15%', animationDelay: '1s'}}></div>
        <div className="absolute w-5 h-5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full opacity-20 floating-animation" style={{top: '40%', right: '25%', animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            ← Back to Courses
          </button>
        </div>

        {/* Course Title and Price */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">{course.title}</h1>
          <p className="text-3xl font-semibold text-blue-800">${course.price}</p>
        </div>

        {/* Course Description */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 card-hover">
          <h2 className="text-2xl font-semibold mb-4">Course Description</h2>
          <p className="text-gray-700 leading-relaxed">{course.description}</p>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 card-hover">
          <h2 className="text-2xl font-semibold mb-4">Skills You'll Learn</h2>
          <div className="flex flex-wrap gap-2">
            {course.skills_data?.map((skill) => (
              <span key={skill.id} className="skill-badge text-white px-3 py-1 rounded-full text-sm font-medium">
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Instructor Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 card-hover">
          <h2 className="text-2xl font-semibold mb-4">About the Instructor</h2>
          <div className="flex items-center space-x-4">
            {course.instructor.profile_picture ? (
              <img 
                src={import.meta.env.VITE_API_URL + course.instructor.profile_picture} 
                alt={course.instructor.name} 
                className="w-16 h-16 rounded-full object-cover" 
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {course.instructor?.name?.charAt(0)?.toUpperCase() || 'I'}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-medium text-gray-800 capitalize">{course.instructor?.name || 'Anonymous Instructor'}</h3>
              <p className="text-sm text-gray-500 capitalize">{course.instructor?.location || 'Location not specified'}</p>
              {course.instructor?.bio && (
                <p className="text-sm text-gray-600 mt-2">{course.instructor.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 card-hover">
          <h2 className="text-2xl font-semibold mb-4">Course Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Enrollments</p>
              <p className="text-lg font-medium">{course.enrollments_count || 0}</p>
            </div>
            <div>
              <p className="text-gray-600">Created At</p>
              <p className="text-lg font-medium">{new Date(course.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;