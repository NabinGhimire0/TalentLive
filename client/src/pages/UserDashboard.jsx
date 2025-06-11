import React, { useState } from 'react';
import { 
  User, 
  Trophy, 
  BookOpen, 
  Briefcase, 
  Plus, 
  Star, 
  Play, 
  CheckCircle, 
  Clock, 
  Award,
  TrendingUp,
  Users,
  FileText,
  Eye,
  Edit,
  Trash2,
  Video,
  Building
} from 'lucide-react';

// Mock data
const mockUser = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  mmr: 1250,
  rank: "Gold III",
  profileImage: "/api/placeholder/100/100"
};

const mockSkills = [
  { id: 1, name: "React", category: "Frontend", verified: true, level: "Advanced", points: 85 },
  { id: 2, name: "Laravel", category: "Backend", verified: false, level: "Intermediate", points: 70 },
  { id: 3, name: "Hospitality Management", category: "Service", verified: true, level: "Expert", points: 95 },
  { id: 4, name: "UI/UX Design", category: "Design", verified: false, level: "Beginner", points: 45 }
];

const mockProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Full-stack web application for online shopping",
    skills: ["React", "Laravel", "MySQL"],
    status: "Completed",
    mmrGained: 150,
    duration: "3 months",
    effectiveness: 4.5
  },
  {
    id: 2,
    title: "Hotel Management System",
    description: "Comprehensive system for hotel operations",
    skills: ["Hospitality Management", "React", "Node.js"],
    status: "In Progress",
    mmrGained: 0,
    duration: "2 months",
    effectiveness: 0
  }
];

const mockTutorials = [
  {
    id: 1,
    title: "Advanced React Patterns",
    skill: "React",
    duration: 120,
    watched: 80,
    instructor: "John Doe",
    mmrReward: 50,
    status: "In Progress"
  },
  {
    id: 2,
    title: "Laravel Best Practices",
    skill: "Laravel",
    duration: 90,
    watched: 90,
    instructor: "Jane Smith",
    mmrReward: 40,
    status: "Completed"
  },
  {
    id: 3,
    title: "Hotel Service Excellence",
    skill: "Hospitality Management",
    duration: 75,
    watched: 0,
    instructor: "Mike Wilson",
    mmrReward: 35,
    status: "Not Started"
  }
];

const mockInternships = [
  {
    id: 1,
    company: "Tech Innovations Inc.",
    position: "Frontend Developer Intern",
    duration: "6 months",
    status: "Completed",
    mmrGained: 200,
    skills: ["React", "JavaScript", "CSS"]
  },
  {
    id: 2,
    company: "Grand Hotel Chain",
    position: "Operations Intern",
    duration: "3 months",
    status: "Active",
    mmrGained: 0,
    skills: ["Hospitality Management", "Customer Service"]
  }
];

// Components
const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'skills', label: 'Skills', icon: Star },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
    { id: 'internships', label: 'Internships', icon: Building },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-8">TalentConnect</h1>
        <nav>
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                  activeTab === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

const Header = ({ user }) => {
  const getRankColor = (rank) => {
    if (rank.includes('Gold')) return 'text-yellow-500';
    if (rank.includes('Silver')) return 'text-gray-400';
    if (rank.includes('Bronze')) return 'text-orange-600';
    return 'text-blue-500';
  };

  return (
    <div className="bg-white shadow-sm border-b p-4 ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Welcome back, {user.name}!</h2>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Trophy className="text-yellow-500" size={20} />
              <span className="font-bold text-lg">{user.mmr} MMR</span>
            </div>
            <div className={`text-sm font-medium ${getRankColor(user.rank)}`}>
              {user.rank}
            </div>
          </div>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user, skills, projects, tutorials }) => {
  const completedTutorials = tutorials.filter(t => t.status === 'Completed').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const verifiedSkills = skills.filter(s => s.verified).length;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total MMR</p>
              <p className="text-3xl font-bold">{user.mmr}</p>
            </div>
            <Trophy size={40} className="text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Verified Skills</p>
              <p className="text-3xl font-bold">{verifiedSkills}</p>
            </div>
            <CheckCircle size={40} className="text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Projects</p>
              <p className="text-3xl font-bold">{completedProjects}</p>
            </div>
            <Briefcase size={40} className="text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Tutorials</p>
              <p className="text-3xl font-bold">{completedTutorials}</p>
            </div>
            <BookOpen size={40} className="text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <p className="font-medium">Completed Laravel Tutorial</p>
                <p className="text-sm text-gray-600">+40 MMR gained</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Plus className="text-blue-500" size={20} />
              <div>
                <p className="font-medium">Added new project: E-commerce Platform</p>
                <p className="text-sm text-gray-600">+150 MMR potential</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Award className="text-yellow-500" size={20} />
              <div>
                <p className="font-medium">React skill verified by mentor</p>
                <p className="text-sm text-gray-600">Verification bonus applied</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">MMR Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Current Rank</span>
                <span className="text-sm text-gray-600">{user.rank}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">250 MMR to next rank</p>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Next Goals</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complete 2 more tutorials (+70 MMR)</li>
                <li>• Get Laravel skill verified (+50 MMR)</li>
                <li>• Finish Hotel Management project (+130 MMR)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Skills = ({ skills, setSkills }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: '', level: 'Beginner' });

  const categories = ['Frontend', 'Backend', 'Design', 'Service', 'Management', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const addSkill = () => {
    const skill = {
      id: Date.now(),
      ...newSkill,
      verified: false,
      points: 0
    };
    setSkills([...skills, skill]);
    setNewSkill({ name: '', category: '', level: 'Beginner' });
    setShowAddModal(false);
  };

  const deleteSkill = (id) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skills Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map(skill => (
          <div key={skill.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{skill.name}</h3>
                <p className="text-gray-600">{skill.category}</p>
              </div>
              <div className="flex space-x-2">
                {skill.verified && <CheckCircle className="text-green-500" size={20} />}
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Level:</span>
                <span className="text-sm font-medium">{skill.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Points:</span>
                <span className="text-sm font-medium">{skill.points}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Status:</span>
                <span className={`text-sm font-medium ${skill.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {skill.verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
            
            {!skill.verified && (
              <button className="w-full mt-4 bg-yellow-100 text-yellow-800 py-2 rounded-lg text-sm hover:bg-yellow-200">
                Request Verification
              </button>
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Skill</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., React, Hotel Management"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addSkill}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Skill
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Projects = ({ projects, setProjects, skills }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    skills: [],
    duration: '',
    status: 'In Progress'
  });

  const addProject = () => {
    const project = {
      id: Date.now(),
      ...newProject,
      mmrGained: 0,
      effectiveness: 0
    };
    setProjects([...projects, project]);
    setNewProject({
      title: '',
      description: '',
      skills: [],
      duration: '',
      status: 'In Progress'
    });
    setShowAddModal(false);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
              <button
                onClick={() => deleteProject(project.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">Skills Used:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.skills.map(skill => (
                    <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Duration:</span>
                <span className="text-sm font-medium">{project.duration}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Status:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              {project.mmrGained > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">MMR Gained:</span>
                  <span className="text-sm font-medium text-green-600">+{project.mmrGained}</span>
                </div>
              )}
              
              {project.effectiveness > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Effectiveness:</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < project.effectiveness ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-blue-100 text-blue-800 py-2 rounded-lg text-sm hover:bg-blue-200">
                View Details
              </button>
              {project.status === 'Completed' && (
                <button className="flex-1 bg-green-100 text-green-800 py-2 rounded-lg text-sm hover:bg-green-200">
                  Claim MMR
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., E-commerce Website"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full p-2 border rounded-lg h-20"
                  placeholder="Brief description of the project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Skills Used</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {skills.map(skill => (
                    <label key={skill.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newProject.skills.includes(skill.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewProject({
                              ...newProject,
                              skills: [...newProject.skills, skill.name]
                            });
                          } else {
                            setNewProject({
                              ...newProject,
                              skills: newProject.skills.filter(s => s !== skill.name)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{skill.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  value={newProject.duration}
                  onChange={(e) => setNewProject({...newProject, duration: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., 3 months"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addProject}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Project
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Tutorials = ({ tutorials }) => {
  const [watchingTutorial, setWatchingTutorial] = useState(null);
  const [watchProgress, setWatchProgress] = useState({});

  const startWatching = (tutorial) => {
    setWatchingTutorial(tutorial);
    setWatchProgress({
      ...watchProgress,
      [tutorial.id]: tutorial.watched
    });
  };

  const updateProgress = (tutorialId, progress) => {
    setWatchProgress({
      ...watchProgress,
      [tutorialId]: progress
    });
  };

  const getProgressColor = (watched, duration) => {
    const percentage = (watched / duration) * 100;
    if (percentage === 100) return 'bg-green-500';
    if (percentage > 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span>;
      case 'In Progress':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">In Progress</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Not Started</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Learning Tutorials</h2>
        <div className="text-sm text-gray-600">
          Complete tutorials to earn MMR based on watch progress
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tutorials.map(tutorial => {
          const currentProgress = watchProgress[tutorial.id] || tutorial.watched;
          const progressPercentage = (currentProgress / tutorial.duration) * 100;
          
          return (
            <div key={tutorial.id} className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">{tutorial.title}</h3>
                <p className="text-gray-600 text-sm">Instructor: {tutorial.instructor}</p>
                <p className="text-gray-600 text-sm">Skill: {tutorial.skill}</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(currentProgress, tutorial.duration)}`}
                      style={{width: `${progressPercentage}%`}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {currentProgress} / {tutorial.duration} minutes watched
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">MMR Reward:</span>
                  <span className="text-sm font-medium text-green-600">+{tutorial.mmrReward}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
                  {getStatusBadge(tutorial.status)}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {tutorial.status !== 'Completed' && (
                  <button
                    onClick={() => startWatching(tutorial)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
                  >
                    <Play size={16} />
                    <span>{tutorial.status === 'Not Started' ? 'Start Tutorial' : 'Continue'}</span>
                  </button>
                )}
                
                {tutorial.status === 'Completed' && (
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

      {watchingTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Watching: {watchingTutorial.title}</h3>
            <div className="space-y-4">
              <div className="bg-gray-900 h-48 rounded-lg flex items-center justify-center">
                <Video className="text-white" size={48} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round((watchProgress[watchingTutorial.id] || watchingTutorial.watched) / watchingTutorial.duration * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={watchingTutorial.duration}
                  value={watchProgress[watchingTutorial.id] || watchingTutorial.watched}
                  onChange={(e) => updateProgress(watchingTutorial.id, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0:00</span>
                  <span>{Math.floor(watchingTutorial.duration / 60)}:{(watchingTutorial.duration % 60).toString().padStart(2, '0')}</span>
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

const Internships = ({ internships, setInternships }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInternship, setNewInternship] = useState({
    company: '',
    position: '',
    duration: '',
    skills: [],
    status: 'Applied'
  });

  const addInternship = () => {
    const internship = {
      id: Date.now(),
      ...newInternship,
      mmrGained: 0
    };
    setInternships([...internships, internship]);
    setNewInternship({
      company: '',
      position: '',
      duration: '',
      skills: [],
      status: 'Applied'
    });
    setShowAddModal(false);
  };

  const deleteInternship = (id) => {
    setInternships(internships.filter(internship => internship.id !== id));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Applied': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Internships</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Internship</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {internships.map(internship => (
          <div key={internship.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{internship.position}</h3>
                <p className="text-gray-600">{internship.company}</p>
              </div>
              <button
                onClick={() => deleteInternship(internship.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">Skills Applied:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {internship.skills.map(skill => (
                    <span key={skill} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Duration:</span>
                <span className="text-sm font-medium">{internship.duration}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Status:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(internship.status)}`}>
                  {internship.status}
                </span>
              </div>
              
              {internship.mmrGained > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">MMR Gained:</span>
                  <span className="text-sm font-medium text-green-600">+{internship.mmrGained}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-blue-100 text-blue-800 py-2 rounded-lg text-sm hover:bg-blue-200">
                View Details
              </button>
              {internship.status === 'Completed' && (
                <button className="flex-1 bg-green-100 text-green-800 py-2 rounded-lg text-sm hover:bg-green-200">
                  Claim MMR
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Internship</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={newInternship.company}
                  onChange={(e) => setNewInternship({...newInternship, company: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="text"
                  value={newInternship.position}
                  onChange={(e) => setNewInternship({...newInternship, position: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Internship position"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  value={newInternship.duration}
                  onChange={(e) => setNewInternship({...newInternship, duration: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., 3 months"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newInternship.status}
                  onChange={(e) => setNewInternship({...newInternship, status: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Applied">Applied</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addInternship}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Internship
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const saveProfile = () => {
    // In a real app, this would update the user data
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <User size={40} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Trophy className="text-yellow-500" size={16} />
              <span className="font-medium">{user.mmr} MMR - {user.rank}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Personal Information</h4>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <Edit size={16} />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded-lg">{user.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded-lg">{user.email}</p>
              )}
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-6 flex space-x-3">
              <button
                onClick={saveProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        <div className="border-t pt-6 mt-6">
          <h4 className="text-lg font-medium mb-4">Account Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{user.mmr}</div>
              <div className="text-sm text-gray-600">Total MMR</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-gray-600">Skills</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Tutorials</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user] = useState(mockUser);
  const [skills, setSkills] = useState(mockSkills);
  const [projects, setProjects] = useState(mockProjects);
  const [tutorials] = useState(mockTutorials);
  const [internships, setInternships] = useState(mockInternships);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard user={user} skills={skills} projects={projects} tutorials={tutorials} />;
      case 'skills':
        return <Skills skills={skills} setSkills={setSkills} />;
      case 'projects':
        return <Projects projects={projects} setProjects={setProjects} skills={skills} />;
      case 'tutorials':
        return <Tutorials tutorials={tutorials} />;
      case 'internships':
        return <Internships internships={internships} setInternships={setInternships} />;
      case 'profile':
        return <Profile user={user} />;
      default:
        return <Dashboard user={user} skills={skills} projects={projects} tutorials={tutorials} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="ml-64">
        <Header user={user} />
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;