import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Save, X, Calendar, Link, User, MapPin, Upload, FileText } from 'lucide-react';
import api from '../../axios.js';
import { toast } from 'react-toastify';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skills, setSkills] = useState([])
  const [IsDelete, setIsDelete] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true)
      try {
        const res = await api.get('api/skills')
        setSkills(res.data.data || [])
      } catch {
        setSkills([])
      }
      setLoading(false)
    }
    fetchSkills()
  }, [])

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [],
    demo: [],
    project_link: '',
    duration: '',
    status: 'ongoing'
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/projects");
        console.log(res.data.data)
        setProjects(res.data.data);
      } catch (err) {
        console.log(err)
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [IsDelete]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      skills: [],
      demo: [],
      project_link: '',
      duration: '',
      status: 'ongoing'
    });
  };

  const openModal = (mode, project = null) => {
    setModalMode(mode);
    setCurrentProject(project);
    if (project && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: project.title,
        description: project.description,
        skills: Array.isArray(project.skills) ? project.skills : JSON.parse(project.skills || '[]'),
        demo: Array.isArray(project.demo) ? project.demo : [],
        project_link: project.project_link,
        duration: project.duration,
        status: project.status
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProject(null);
    resetForm();
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({
      ...prev,
      skills: selectedOptions
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      demo: files
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      demo: prev.demo.filter((_, i) => i !== index)
    }));
  };

  const getSkillName = (skillId) => {
    const skill = skills.find(s => s.id === skillId);
    return skill ? skill.name : `Skill ${skillId}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('skills', JSON.stringify(formData.skills));
      formDataToSend.append('project_link', formData.project_link);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('status', formData.status);
      
      // Append demo files
      if (formData.demo && formData.demo.length > 0) {
        formData.demo.forEach((file, index) => {
          formDataToSend.append(`demo[${index}]`, file);
        });
      }

      if (modalMode === 'create') {
        formDataToSend.append('user_id', '7');
        const res = await api.post("/api/projects", formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(res.data)
        if (res.data.success) {
          toast.success(res.data.message || "Project created successfully");
          setIsDelete(prev => !prev)
        }
      } else if (modalMode === 'edit') {
        const res = await api.put(`/api/projects/${currentProject.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (res.data.success) {
          toast.success(res.data.message || "Project updated successfully");
          setIsDelete(prev => !prev)
        }
      }
      closeModal();
    } catch (err) {
      setError('Failed to save project');
      toast.error('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    setLoading(true);
    try {
      const res = await api.delete(`/api/projects/${projectId}`);
      setIsDelete(prev => !prev);
      toast.success("Project deleted successfully");
      console.log(res)
    } catch (err) {
      setError('Failed to delete project');
      toast.error('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Manager</h1>
            <p className="text-gray-600 mt-2">Manage all your projects in one place</p>
          </div>
          <button
            onClick={() => openModal('create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            New Project
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Projects Grid */}
        {loading && projects.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 truncate">{project.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                  {/* Skills Display */}
                  {project.skills && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(project.skills) ? project.skills : JSON.parse(project.skills || '[]')).slice(0, 3).map((skillId, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {getSkillName(skillId)}
                          </span>
                        ))}
                        {(Array.isArray(project.skills) ? project.skills : JSON.parse(project.skills || '[]')).length > 3 && (
                          <span className="text-xs text-gray-500">+{(Array.isArray(project.skills) ? project.skills : JSON.parse(project.skills || '[]')).length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      Duration: {project.duration}
                    </div>
                    {project.project_link && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Link size={16} className="mr-2" />
                        <a href={project.project_link} target="_blank" rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate">
                          Project Link
                        </a>
                      </div>
                    )}
                    {project.demo && Array.isArray(project.demo) && project.demo.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText size={16} className="mr-2" />
                        {project.demo.length} demo file{project.demo.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 mb-4">
                    Updated: {formatDate(project.updated_at)}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal('view', project)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openModal('edit', project)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {projects.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first project</p>
            <button
              onClick={() => openModal('create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Create Project
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'create' && 'Create New Project'}
                  {modalMode === 'edit' && 'Edit Project'}
                  {modalMode === 'view' && 'Project Details'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {modalMode === 'view' ? (
                /* View Mode */
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{currentProject?.title}</h3>
                    <p className="text-gray-600">{currentProject?.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentProject?.status)}`}>
                        {currentProject?.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <p className="text-gray-900">{currentProject?.duration}</p>
                    </div>
                  </div>

                  {currentProject?.project_link && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                      <a href={currentProject.project_link} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all">
                        {currentProject.project_link}
                      </a>
                    </div>
                  )}

                  {formData.skills && formData.skills.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skillId, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {getSkillName(skillId)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.demo && formData.demo.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Demo Files</label>
                      <div className="space-y-1">
                        {formData.demo.map((demo, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <FileText size={16} className="mr-2 text-gray-500" />
                            <span className="text-gray-700">
                              {typeof demo === 'string' ? demo : demo.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                      <label className="block font-medium mb-1">Created</label>
                      <p>{formatDate(currentProject?.created_at)}</p>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Updated</label>
                      <p>{formatDate(currentProject?.updated_at)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Create/Edit Form */
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <select
                      multiple
                      value={formData.skills.map(String)}
                      onChange={handleSkillsChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                    >
                      {skills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple skills</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="paused">Paused</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 3 months"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Link</label>
                    <input
                      type="url"
                      name="project_link"
                      value={formData.project_link}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/project"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Demo Files</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        className="w-full"
                        id="demo-files"
                      />
                      <div className="text-center mt-2">
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Upload photos, videos, or documents
                        </p>
                      </div>
                    </div>
                    
                    {formData.demo && formData.demo.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-700">Selected files:</p>
                        {formData.demo.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center">
                              <FileText size={16} className="mr-2 text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      {modalMode === 'create' ? 'Create Project' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;