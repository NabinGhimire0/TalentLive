import { Plus, Star, Trash2 } from "lucide-react";
import data from "./data.js"
import { useState } from "react";
const Projects = () => {
  const [projects, setProjects] = useState(data.mockProjects);
  const [skills, setSkills] = useState(data.mockSkills);
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
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
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
export default Projects