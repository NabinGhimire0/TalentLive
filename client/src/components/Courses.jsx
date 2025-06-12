import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';

const CoursesHome = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await api.get("api/frontend/courses");
        // Show only top 6 courses
        setCourses(res.data.data.slice(0, 6));
        console.log(res.data.data);
      } catch (error) {
        setError('Failed to load courses');
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleRippleEffect = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const handleViewAllCourses = () => {
    navigate('/courses');
  };

  const handleEnrollNow = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden">
      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        
        .gradient-text {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .card-hover {
          transition: all 0.4s ease;
          transform: translateY(0);
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .btn-hover {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
        }
        
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          pointer-events: none;
          transform: scale(0);
          animation: rippleEffect 0.6s ease-out;
        }
        
        @keyframes rippleEffect {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .floating-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        .skill-badge {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          transition: all 0.3s ease;
        }
        
        .skill-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
        }
        
        .instructor-card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.9);
        }
      `}</style>

      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 floating-animation" style={{top: '15%', left: '10%'}}></div>
        <div className="absolute w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 floating-animation" style={{top: '70%', right: '15%', animationDelay: '1s'}}></div>
        <div className="absolute w-5 h-5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full opacity-20 floating-animation" style={{top: '40%', right: '25%', animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            Discover <span className="gradient-text">Our Courses</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Learn from passionate instructors and build the skills that matter in today's tech world. 
            Start your journey with our comprehensive courses.
          </p>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">📚</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Courses Available</h3>
            <p className="text-gray-600">Check back soon for new courses!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div 
                key={course.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover cursor-pointer"
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => handleEnrollNow(course.id)}
              >
                {/* Course Header */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium ml-4 flex-shrink-0">
                      ${course.price}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.skills_data?.map((skill) => (
                      <span 
                        key={skill.id} 
                        className="skill-badge text-white px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="px-6 pb-4">
                  <div className="instructor-card rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {course.instructor?.name?.charAt(0)?.toUpperCase() || 'I'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 capitalize truncate">
                          {course.instructor?.name || 'Anonymous Instructor'}
                        </h4>
                        <p className="text-xs text-gray-500 capitalize truncate">
                          {course.instructor?.location || 'Location not specified'}
                        </p>
                        {course.instructor?.bio && (
                          <p className="text-xs text-gray-600 truncate mt-1">
                            {course.instructor.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Footer */}
                <div className="px-6 pb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        {course.enrollments_count || 0} enrolled
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(course.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRippleEffect(e);
                      handleEnrollNow(course.id);
                    }}
                    className="w-full px-6 py-3 bg-blue-800 text-white rounded-xl font-medium btn-hover shadow-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More Button */}
        {courses.length > 0 && (
          <div className="text-center mt-16">
            <button 
              onClick={(e) => {
                handleRippleEffect(e);
                handleViewAllCourses();
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-full font-medium btn-hover shadow-lg"
            >
              View All Courses <span className="ml-2">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesHome;