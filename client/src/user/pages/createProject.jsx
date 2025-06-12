import React, { useState, useEffect } from 'react';
import {
    Save,
    X,
    Upload,
    FileText,
    ExternalLink
} from 'lucide-react';
import Select from 'react-select';
import api from '../../axios.js';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CreateProject = () => {
    // State Management
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
    const [currentProject, setCurrentProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [skills, setSkills] = useState([]);
    const [IsDelete, setIsDelete] = useState(false);

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

    // Constants
    const STATUS_OPTIONS = [
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'completed', label: 'Completed' },
        { value: 'paused', label: 'Paused' }
    ];

    // Effects
    useEffect(() => {
        fetchSkills();
    }, []);

    // API Functions
    const fetchSkills = async () => {
        setLoading(true);
        try {
            const res = await api.get('api/skills');
            console.log(res.data)
            setSkills(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch skills:', error);
            setSkills([]);
            toast.error('Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const formDataToSend = createFormData();
            const response = await submitProject(formDataToSend);

            if (response.data.success) {
                toast.success(response.data.message || "Project saved successfully");
                setIsDelete(prev => !prev);
                resetForm();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save project';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const submitProject = async (formDataToSend) => {
        if (modalMode === 'create') {
            // formDataToSend.append('user_id', '7');

            return await api.post("/api/projects", formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } else if (modalMode === 'edit') {
            return await api.put(`/api/projects/${currentProject.id}`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }
    };

    // Helper Functions
    const createFormData = () => {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        console.log(formData.skills)
        // return
        const skillsArray = formData.skills.map(skill => skill.value);
        // console.log(skillsArray)

        console.log(Array.from(skillsArray))
        // formDataToSend.append('skills', JSON.stringify(skillsArray));
        skillsArray.forEach(skill => {
            formDataToSend.append('skills[]', skill);
        });

        formDataToSend.append('project_link', formData.project_link);
        formDataToSend.append('duration', formData.duration);
        formDataToSend.append('status', formData.status);

        if (formData.demo && formData.demo.length > 0) {
            formData.demo.forEach((file, index) => {
                formDataToSend.append(`demo[${index}]`, file);
            });
        }

        return formDataToSend;
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            toast.error('Project title is required');
            return false;
        }
        if (!formData.description.trim()) {
            toast.error('Project description is required');
            return false;
        }
        return true;
    };

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

    const getSkillOptions = () => {
        return skills.map(skill => ({
            value: skill.id,
            label: skill.name
        }));
    };

    const getSkillName = (skillId) => {
        const skill = skills.find(s => s.id === skillId);
        return skill ? skill.name : `Skill ${skillId}`;
    };

    const getStatusColor = (status) => {
        const statusColors = {
            ongoing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            paused: 'bg-yellow-100 text-yellow-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Event Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillsChange = (selectedOptions) => {
        setFormData(prev => ({
            ...prev,
            skills: selectedOptions || []
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 10 * 1024 * 1024; // 10MB
        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
                return false;
            }
            return true;
        });

        setFormData(prev => ({
            ...prev,
            demo: [...prev.demo, ...validFiles]
        }));
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            demo: prev.demo.filter((_, i) => i !== index)
        }));
    };

    // Custom Styles for React Select
    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
            '&:hover': {
                borderColor: '#3b82f6'
            }
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#dbeafe',
            color: '#1e40af'
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#1e40af'
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#1e40af',
            '&:hover': {
                backgroundColor: '#3b82f6',
                color: 'white'
            }
        })
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-6 rounded-t-xl">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {modalMode === 'create' && 'Create New Project'}
                                        {modalMode === 'edit' && 'Edit Project'}
                                        {modalMode === 'view' && 'Project Details'}
                                    </h2>
                                    <p className="text-blue-100 mt-1">
                                        {modalMode === 'create' && 'Add a new project to your portfolio'}
                                        {modalMode === 'edit' && 'Update your project information'}
                                        {modalMode === 'view' && 'View project details'}
                                    </p>
                                </div>
                                <Link to={"/user/projects"} className="bg-white/20 p-2 rounded-lg">
                                    {/* {modalMode === 'create' && <Plus size={24} />} */}
                                    back
                                    
                                </Link>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    {error}
                                </div>
                            )}

                            {modalMode === 'view' ? (
                                /* View Mode */
                                <div className="space-y-8">
                                    {/* Project Title & Description */}
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {currentProject?.title}
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {currentProject?.description}
                                        </p>
                                    </div>

                                    {/* Project Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Status
                                            </label>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentProject?.status)}`}>
                                                {currentProject?.status?.charAt(0).toUpperCase() + currentProject?.status?.slice(1)}
                                            </span>
                                        </div>

                                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Duration
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {currentProject?.duration || 'Not specified'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Project Link */}
                                    {currentProject?.project_link && (
                                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Project Link
                                            </label>
                                            <a
                                                href={currentProject.project_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium"
                                            >
                                                <ExternalLink size={16} />
                                                {currentProject.project_link}
                                            </a>
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {formData.skills && formData.skills.length > 0 && (
                                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Skills Used
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.skills.map((skillId, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                                    >
                                                        {getSkillName(skillId)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Demo Files */}
                                    {formData.demo && formData.demo.length > 0 && (
                                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Demo Files
                                            </label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {formData.demo.map((demo, index) => (
                                                    <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                                                        <FileText size={20} className="mr-3 text-blue-600" />
                                                        <span className="text-gray-800 font-medium">
                                                            {typeof demo === 'string' ? demo : demo.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Timestamps */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Created
                                            </label>
                                            <p className="text-gray-600">
                                                {formatDate(currentProject?.created_at)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Last Updated
                                            </label>
                                            <p className="text-gray-600">
                                                {formatDate(currentProject?.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Create/Edit Form */
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Project Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter your project title"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            required
                                            placeholder="Describe your project in detail..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                                        />
                                    </div>

                                    {/* Skills Selection with React Select */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Skills & Technologies
                                        </label>
                                        <Select
                                            isMulti
                                            options={getSkillOptions()}
                                            value={formData.skills}
                                            onChange={handleSkillsChange}
                                            placeholder="Select skills used in this project..."
                                            styles={selectStyles}
                                            isLoading={loading && skills.length === 0}
                                            noOptionsMessage={() => "No skills available"}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Select multiple skills that were used in this project
                                        </p>
                                    </div>

                                    {/* Status and Duration Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Project Status
                                            </label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            >
                                                {STATUS_OPTIONS.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Duration
                                            </label>
                                            <input
                                                type="text"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 3 months, 2 weeks"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Project Link */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Project Link
                                        </label>
                                        <input
                                            type="url"
                                            name="project_link"
                                            value={formData.project_link}
                                            onChange={handleInputChange}
                                            placeholder="https://github.com/username/project"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Link to your project repository, demo, or website
                                        </p>
                                    </div>

                                    {/* Demo Files Upload */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Demo Files
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                                accept="image/*,video/*,.pdf,.doc,.docx"
                                                className="hidden"
                                                id="demo-files"
                                            />
                                            <label htmlFor="demo-files" className="cursor-pointer">
                                                <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                                                <p className="text-sm font-medium text-gray-700 mb-1">
                                                    Click to upload files
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Support: Images, Videos, PDFs, Documents (Max 10MB each)
                                                </p>
                                            </label>
                                        </div>

                                        {/* Selected Files Display */}
                                        {formData.demo && formData.demo.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    Selected files ({formData.demo.length}):
                                                </p>
                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                    {formData.demo.map((file, index) => (
                                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                            <div className="flex items-center">
                                                                <FileText size={16} className="mr-3 text-blue-600" />
                                                                <div>
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {file.name}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500 ml-2">
                                                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(index)}
                                                                className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                                                title="Remove file"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                        <Link
                                            to="/user/projects"
                                            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-lg hover:shadow-xl"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={16} />
                                                    {modalMode === 'create' ? 'Create Project' : 'Save Changes'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;