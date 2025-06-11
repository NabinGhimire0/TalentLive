import React, { useState } from 'react';
import { 
  User, 
  Plus, 
  Star, 
  Trophy, 
  BookOpen, 
  Briefcase, 
  Settings, 
  LogOut,
  Play,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Award,
  Eye,
  Edit3,
  Trash2,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Calendar,
  Bell
} from 'lucide-react';

// Mock data
const mockUserData = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  mmr: 1847,
  rank: "Gold",
  level: 12,
  skills: [
    { id: 1, name: "React", level: "Advanced", verified: true, points: 450 },
    { id: 2, name: "Node.js", level: "Intermediate", verified: true, points: 320 },
    { id: 3, name: "Hospitality", level: "Expert", verified: false, points: 280 },
    { id: 4, name: "Laravel", level: "Beginner", verified: false, points: 150 }
  ],
  projects: [
    { id: 1, name: "E-commerce Platform", skills: ["React", "Node.js"], mmr: 150, status: "Completed" },
    { id: 2, name: "Hotel Management System", skills: ["Laravel", "Hospitality"], mmr: 120, status: "In Progress" }
  ],
  tutorials: [
    { id: 1, name: "Advanced React Patterns", progress: 75, duration: 240, mmr: 50 },
    { id: 2, name: "Laravel Fundamentals", progress: 30, duration: 180, mmr: 25 }
  ],
  internships: [
    { id: 1, company: "TechCorp", role: "Frontend Developer", status: "Active", mmr: 200 }
  ]
};

const mockMentorData = {
  name: "Dr. Sarah Wilson",
  email: "sarah.wilson@mentor.com",
  totalStudents: 47,
  totalTutorials: 23,
  skillsVerified: 156,
  students: [
    { id: 1, name: "Alex Johnson", mmr: 1847, progress: 75, lastActive: "2 hours ago" },
    { id: 2, name: "Emma Davis", mmr: 1523, progress: 60, lastActive: "1 day ago" },
    { id: 3, name: "Michael Chen", mmr: 2105, progress: 90, lastActive: "30 min ago" }
  ],
  tutorials: [
    { id: 1, title: "Advanced React Patterns", views: 234, rating: 4.8, status: "Published" },
    { id: 2, title: "Laravel Best Practices", views: 189, rating: 4.6, status: "Draft" }
  ],
  skillRequests: [
    { id: 1, student: "Alex Johnson", skill: "Hospitality", level: "Expert", submitted: "2 hours ago" },
    { id: 2, student: "Emma Davis", skill: "Vue.js", level: "Intermediate", submitted: "1 day ago" }
  ]
};

// Components
const Sidebar = ({ activeTab, setActiveTab, userType }) => {
  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'skills', label: 'Skills', icon: Star },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
    { id: 'internships', label: 'Internships', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const mentorMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
    { id: 'verification', label: 'Skill Verification', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const menuItems = userType === 'mentor' ? mentorMenuItems : userMenuItems;

  return (
    <div className="w-64 bg-gradient-to-b from-purple-900 to-indigo-900 text-white h-screen fixed left-0 top-0 z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          TalentForge
        </h1>
        <p className="text-purple-200 text-sm mt-1">
          {userType === 'mentor' ? 'Mentor Portal' : 'Connect & Grow'}
        </p>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-white/10 transition-all duration-200 ${
                activeTab === item.id ? 'bg-white/20 border-r-4 border-yellow-400' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button className="w-full flex items-center px-4 py-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-all">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {mockUserData.name}!</h1>
          <p className="text-gray-600 mt-1">Track your progress and level up your skills</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{mockUserData.mmr}</div>
              <div className="text-sm opacity-90">MMR</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="text-lg font-bold">{mockUserData.rank}</div>
              <div className="text-sm opacity-90">Rank</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Skills</p>
              <p className="text-2xl font-bold text-gray-900">{mockUserData.skills.length}</p>
            </div>
            <Star className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Projects</p>
              <p className="text-2xl font-bold text-gray-900">{mockUserData.projects.length}</p>
            </div>
            <Briefcase className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tutorials</p>
              <p className="text-2xl font-bold text-gray-900">{mockUserData.tutorials.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Level</p>
              <p className="text-2xl font-bold text-gray-900">{mockUserData.level}</p>
            </div>
            <Trophy className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Skills</h3>
          <div className="space-y-3">
            {mockUserData.skills.slice(0, 3).map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${skill.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{skill.name}</p>
                    <p className="text-sm text-gray-600">{skill.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-purple-600">{skill.points} pts</p>
                  {skill.verified && <CheckCircle className="w-4 h-4 text-green-500 inline" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Tutorials</h3>
          <div className="space-y-3">
            {mockUserData.tutorials.map((tutorial) => (
              <div key={tutorial.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{tutorial.name}</p>
                  <span className="text-sm text-purple-600">+{tutorial.mmr} MMR</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${tutorial.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{tutorial.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillsPage = () => {
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
          <p className="text-gray-600 mt-1">Manage and showcase your abilities</p>
        </div>
        <button 
          onClick={() => setShowAddSkill(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Skill</span>
        </button>
      </div>

      {showAddSkill && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Skill</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                placeholder="e.g., React, Hospitality, Design"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Add Skill
            </button>
            <button 
              onClick={() => setShowAddSkill(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUserData.skills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{skill.name}</h3>
              <div className="flex items-center space-x-2">
                {skill.verified ? (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                ) : (
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Proficiency</span>
                  <span>{skill.level}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      skill.level === 'Expert' ? 'bg-red-500' :
                      skill.level === 'Advanced' ? 'bg-orange-500' :
                      skill.level === 'Intermediate' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${
                        skill.level === 'Expert' ? 100 :
                        skill.level === 'Advanced' ? 75 :
                        skill.level === 'Intermediate' ? 50 : 25
                      }%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-600">{skill.points}</span>
                <span className="text-sm text-gray-500">skill points</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  const [showAddProject, setShowAddProject] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Showcase your work and earn MMR</p>
        </div>
        <button 
          onClick={() => setShowAddProject(true)}
          className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      {showAddProject && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Project</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                placeholder="Enter project name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows="3"
                placeholder="Describe your project"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills Used</label>
              <input
                type="text"
                placeholder="e.g., React, Node.js, Design"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Add Project
            </button>
            <button 
              onClick={() => setShowAddProject(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockUserData.projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {project.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Technologies Used:</p>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-2xl font-bold text-green-600">+{project.mmr}</span>
                <span className="text-sm text-gray-500">MMR earned</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TutorialsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Tutorials</h1>
        <p className="text-gray-600 mt-1">Watch tutorials and earn MMR based on your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockUserData.tutorials.map((tutorial) => (
          <div key={tutorial.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{tutorial.name}</h3>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                +{tutorial.mmr} MMR
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{tutorial.progress}% complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${tutorial.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Duration: {tutorial.duration} minutes</span>
                <span>{Math.round(tutorial.duration * tutorial.progress / 100)} min watched</span>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>{tutorial.progress > 0 ? 'Continue Watching' : 'Start Tutorial'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InternshipsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internships</h1>
          <p className="text-gray-600 mt-1">Track your internship experience and MMR gains</p>
        </div>
        <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Internship</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockUserData.internships.map((internship) => (
          <div key={internship.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{internship.role}</h3>
                <p className="text-gray-600">{internship.company}</p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {internship.status}
                </span>
                <p className="text-2xl font-bold text-orange-600 mt-2">+{internship.mmr} MMR</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mentor Components
const MentorDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {mockMentorData.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{mockMentorData.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tutorials Created</p>
              <p className="text-2xl font-bold text-gray-900">{mockMentorData.totalTutorials}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Skills Verified</p>
              <p className="text-2xl font-bold text-gray-900">{mockMentorData.skillsVerified}</p>
            </div>
            <Award className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{mockMentorData.skillRequests.length}</p>
            </div>
            <Bell className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Students</h3>
          <div className="space-y-3">
            {mockMentorData.students.slice(0, 3).map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">Last active: {student.lastActive}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{student.mmr} MMR</p>
                  <p className="text-sm text-gray-600">{student.progress}% progress</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Skill Verifications</h3>
          <div className="space-y-3">
            {mockMentorData.skillRequests.map((request) => (
              <div key={request.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{request.student}</p>
                  <span className="text-sm text-gray-500">{request.submitted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Skill: <span className="font-medium">{request.skill}</span></p>
                    <p className="text-sm text-gray-600">Level: <span className="font-medium">{request.level}</span></p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors">
                      Approve
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MentorStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
          <p className="text-gray-600 mt-1">Monitor and guide your students' progress</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Students</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMentorData.students.map((student) => (
          <div key={student.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {student.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">Last active: {student.lastActive}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Progress</span>
                  <span>{student.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-purple-600">{student.mmr}</span>
                <span className="text-sm text-gray-500">MMR</span>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-200">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MentorTutorials = () => {
  const [showCreateTutorial, setShowCreateTutorial] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tutorial Management</h1>
          <p className="text-gray-600 mt-1">Create and manage learning content for your students</p>
        </div>
        <button 
          onClick={() => setShowCreateTutorial(true)}
          className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Tutorial</span>
        </button>
      </div>

      {showCreateTutorial && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Tutorial</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tutorial Title</label>
                <input
                  type="text"
                  placeholder="Enter tutorial title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill Category</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="">Select category</option>
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows="3"
                placeholder="Describe what students will learn"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  placeholder="60"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MMR Reward</label>
                <input
                  type="number"
                  placeholder="50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Create Tutorial
            </button>
            <button 
              onClick={() => setShowCreateTutorial(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMentorData.tutorials.map((tutorial) => (
          <div key={tutorial.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{tutorial.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                tutorial.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {tutorial.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{tutorial.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{tutorial.rating}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-3 border-t border-gray-200">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillVerification = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Skill Verification</h1>
        <p className="text-gray-600 mt-1">Review and verify student skill claims</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Verifications</h3>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Approve All
            </button>
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
              Filter
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mockMentorData.skillRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {request.student.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{request.student}</h4>
                    <p className="text-sm text-gray-600">Submitted {request.submitted}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{request.skill}</p>
                  <p className="text-sm text-gray-600">Level: {request.level}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1">
                  <span>Reject</span>
                </button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                  Request Evidence
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MentorAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your mentoring impact and student performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Student MMR</p>
              <p className="text-2xl font-bold text-gray-900">1,825</p>
              <p className="text-green-600 text-sm flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% this month
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tutorial Completion</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
              <p className="text-green-600 text-sm flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5% this week
              </p>
            </div>
            <PieChart className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">34</p>
              <p className="text-green-600 text-sm flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +3 this week
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Skills Verified</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-gray-600 text-sm flex items-center mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                This week
              </p>
            </div>
            <Award className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress Overview</h3>
          <div className="space-y-4">
            {mockMentorData.students.map((student) => (
              <div key={student.id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{student.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{student.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tutorial Performance</h3>
          <div className="space-y-4">
            {mockMentorData.tutorials.map((tutorial) => (
              <div key={tutorial.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{tutorial.title}</p>
                  <p className="text-sm text-gray-600">{tutorial.views} views</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{tutorial.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const TalentPlatform = () => {
  const [userType, setUserType] = useState('user'); // 'user' or 'mentor'
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderUserContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <UserDashboard />;
      case 'skills':
        return <SkillsPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'tutorials':
        return <TutorialsPage />;
      case 'internships':
        return <InternshipsPage />;
      default:
        return <UserDashboard />;
    }
  };

  const renderMentorContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MentorDashboard />;
      case 'students':
        return <MentorStudents />;
      case 'tutorials':
        return <MentorTutorials />;
      case 'verification':
        return <SkillVerification />;
      case 'analytics':
        return <MentorAnalytics />;
      default:
        return <MentorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userType={userType} />
      
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* User Type Switcher */}
          <div className="mb-6 flex justify-end">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => {
                  setUserType('user');
                  setActiveTab('dashboard');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  userType === 'user'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => {
                  setUserType('mentor');
                  setActiveTab('dashboard');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  userType === 'mentor'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mentor View
              </button>
            </div>
          </div>

          {/* Content */}
          {userType === 'user' ? renderUserContent() : renderMentorContent()}
        </div>
      </div>
    </div>
  );
};

export default TalentPlatform;