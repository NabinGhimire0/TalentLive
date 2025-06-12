import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import NavBar from '../components/NavBar';

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await api.get("api/profiles");
        const profilesData = res.data.data;
        // Sort profiles by MMR (highest first, null MMRs at the end)
        const sortedProfiles = profilesData.sort((a, b) => {
          const aMMR = a.mmr?.total_mmr ? parseFloat(a.mmr.total_mmr) : -Infinity;
          const bMMR = b.mmr?.total_mmr ? parseFloat(b.mmr.total_mmr) : -Infinity;
          return bMMR - aMMR;
        });
        setProfiles(sortedProfiles);
        setFilteredProfiles(sortedProfiles);
      } catch (error) {
        setError('Failed to load profiles');
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = profiles.filter(profile =>
      profile.personal_info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.personal_info.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.personal_info.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.personal_info.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.skills?.some(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredProfiles(filtered);
  }, [searchTerm, profiles]);

  const handleRippleEffect = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = 'absolute rounded-full bg-white/50 pointer-events-none transform scale-0 animate-ripple';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };

  const closeDialog = () => {
    setSelectedProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
            <p className="mt-4 text-gray-600">Loading profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden font-poppins">
      <NavBar />
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 animate-float" style={{ top: '15%', left: '10%' }}></div>
        <div className="absolute w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float" style={{ top: '70%', right: '15%', animationDelay: '1s' }}></div>
        <div className="absolute w-5 h-5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full opacity-20 animate-float" style={{ top: '40%', right: '25%', animationDelay: '2s' }}></div>
        <div className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-float" style={{ top: '25%', left: '70%', animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            All <span className="bg-gradient-to-r from-blue-800 to-blue-400 bg-clip-text text-transparent">Profiles</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover our community of talented individuals, their skills, projects, and achievements.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, skills, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/90 backdrop-blur-md border-2 border-blue-200/50 outline-none text-gray-700 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-6 bg-white rounded-2xl px-8 py-4 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue Queen-800">{profiles.length}</div>
              <div className="text-sm text-gray-600">Total Profiles</div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{filteredProfiles.length}</div>
              <div className="text-sm text-gray-600">Showing</div>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">🔍</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No profiles found' : 'No Profiles Available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Check back soon for new profiles!'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProfiles.map((profile, index) => (
              <div 
                key={profile.personal_info.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleProfileClick(profile)}
              >
                {/* Profile Header */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-tight capitalize">
                      {profile.personal_info.name}
                    </h3>
                    {/* {profile.mmr?.total_mmr && (
                      <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0">
                        MMR: {parseFloat(profile.mmr.total_mmr).toFixed(2)}
                      </div>
                    )} */}
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {profile.personal_info.bio || 'No bio available'}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {profile.skills?.slice(0, 2).map((skill) => (
                      <span 
                        key={skill.id} 
                        className="bg-gradient-to-r from-blue-800 to-blue-400 text-white px-2 py-1 rounded-full text-xs font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {profile.skills?.length > 2 && (
                      <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                        +{profile.skills.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-4">
                  <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-xs">
                          {profile.personal_info.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 capitalize truncate text-sm">
                          {profile.personal_info.role || 'No role specified'}
                        </h4>
                        <p className="text-xs text-gray-500 capitalize truncate">
                          {profile.personal_info.location || 'Location not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="px-6 pb-6">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRippleEffect(e);
                      handleProfileClick(profile);
                    }}
                    className="w-full px-4 py-2 bg-blue-800 text-white rounded-xl font-medium relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popup Dialog */}
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/50 transition-opacity duration-300"
              onClick={closeDialog}
            ></div>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100" data-state={selectedProfile ? 'open' : 'closed'}>
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 capitalize">{selectedProfile.personal_info.name}</h2>
                  <button 
                    onClick={closeDialog}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xl">
                        {selectedProfile.personal_info.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Role: <span className="capitalize">{selectedProfile.personal_info.role || 'No role specified'}</span></p>
                      <p className="text-sm text-gray-600">Location: <span className="capitalize">{selectedProfile.personal_info.location || 'Not specified'}</span></p>
                      {selectedProfile.mmr?.total_mmr && (
                        <p className="text-sm text-gray-600">MMR: {parseFloat(selectedProfile.mmr.total_mmr).toFixed(2)}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
                    <p className="text-sm text-gray-600">{selectedProfile.personal_info.bio || 'No bio available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact</h3>
                    <p className="text-sm text-gray-600">Email: {selectedProfile.personal_info.email}</p>
                    {selectedProfile.personal_info.github_id && (
                      <p className="text-sm text-gray-600">
                        GitHub: <a 
                          href={`https://github.com/${selectedProfile.personal_info.github_id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedProfile.personal_info.github_id}
                        </a>
                      </p>
                    )}
                  </div>

                  {selectedProfile.skills?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.skills.map((skill) => (
                          <span 
                            key={skill.id} 
                            className="bg-gradient-to-r from-blue-800 to-blue-400 text-white px-3 py-1 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-md"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProfile.projects?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Projects</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                        {selectedProfile.projects.map(project => (
                          <li key={project.id}>
                            {project.title} - {project.status} 
                            {project.project_link && (
                              <a 
                                href={project.project_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline ml-1"
                              >
                                (Link)
                              </a>
                            )}
                            <p className="text-xs text-gray-500">{project.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedProfile.work_history?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Work History</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                        {selectedProfile.work_history.map(work => (
                          <li key={work.id}>
                            {work.position} at {work.company.name} ({work.type}, {work.start_date.slice(0, 10)} to {work.end_date?.slice(0, 10) || 'Present'})
                            <p className="text-xs text-gray-500">{work.responsibilities}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedProfile.education?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Education</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                        {selectedProfile.education.map(edu => (
                          <li key={edu.id}>
                            {edu.degree} in {edu.field_of_study} from {edu.institution} ({edu.start_date.slice(0, 10)} to {edu.end_date?.slice(0, 10) || 'Present'})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedProfile.courses?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Courses</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                        {selectedProfile.courses.map(course => (
                          <li key={course.id}>
                            {course.course.title} by {course.course.instructor.name} ({course.price === "0" ? 'Free' : `$${course.price}`})
                            <p className="text-xs text-gray-500">{course.course.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={(e) => {
                      handleRippleEffect(e);
                      closeDialog();
                    }}
                    className="px-6 py-2 bg-blue-800 text-white rounded-xl font-medium relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-16">
          <button 
            onClick={(e) => {
              handleRippleEffect(e);
              navigate('/');
            }}
            className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full font-medium relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Inline Tailwind Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes ripple {
            to {
              transform: scale(2);
              opacity: 0;
            }
          }
          .animate-ripple {
            animation: ripple 0.6s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default ProfilesPage;