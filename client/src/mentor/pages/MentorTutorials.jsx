import { Edit3, Eye, Plus, Star, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../axios";
import Select from 'react-select';
import { toast } from "react-toastify";

const CourseManagement = () => {
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    price: "",
    video: null
  });
  const [refetch, setRefetch] = useState(true)

  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      video: file
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      // formDataToSend.append('skills', JSON.stringify(formData.skills));
      Array.isArray(formData.skills) && formData.skills.forEach(element => {
        formDataToSend.append('skills[]', element.value);
      });
      formDataToSend.append('price', formData.price);

      if (formData.video) {
        formDataToSend.append('video', formData.video);
      }

      // Simulate API call


      // Simulate API response
      // await new Promise(resolve => setTimeout(resolve, 1000));

      // Add new course to local state (in real app, this would come from API response)
      try {
        const res = await api.post("/api/courses", formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        if (res.data.success) {
          toast.success(res.data.message || "course created successfully");
          setRefetch(!refetch)
        }

      } catch (error) {
        toast.error(error.response.data.message || "Error creating course. Please try again.")
      }

      // console.log(res.data)
      // setCourses(prev => [...prev, res.data.data]);
      setShowCreateCourse(false);

      // alert('Course created successfully!');
    } catch (error) {
      console.log('Error creating course:', error);
      // alert('Error creating course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        // Simulate API call
        console.log('Deleting course:', courseId);
        await new Promise(resolve => setTimeout(resolve, 500));

        setCourses(prev => prev.filter(course => course.id !== courseId));
        alert('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course. Please try again.');
      }
    }
  };


  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const res = await api.get('api/skills');
        console.log(res)
        console.log(res.data)
        setSkills(res.data.data || []);
      } catch (error) {

        console.log('Failed to fetch skills:', error);
        setSkills([]);
        toast.error('Failed to load skills');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [refetch]);

  const getSkillOptions = () => {
    return skills.map(skill => ({
      value: skill.id,
      label: skill.name
    }));
  };
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('api/courses');
        console.log(response.data.data)
        setCourses(response.data.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [])
  const handleSkillsChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      skills: selectedOptions || []
    }));
  };
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
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Create and manage learning courses for your students</p>
        </div>
        <button
          onClick={() => setShowCreateCourse(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Course</span>
        </button>
      </div>

      {showCreateCourse && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Create New Course</h3>
            <button
              onClick={() => setShowCreateCourse(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter course title"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="99.99"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe what students will learn"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div>

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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Video</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formData.video ? formData.video.name : 'Click to upload video'}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Course'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateCourse(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(courses) && courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                {course.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {course.skills_data.slice(0, 3).map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {skill?.name}
                </span>
              ))}
              {course.skills.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  +{course.skills.length - 3} more
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{course.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{course.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">RS{course.price}</span>
                {course.hasVideo && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Video included
                  </span>
                )}
              </div>

              <div className="flex space-x-2 pt-3 border-t border-gray-200">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No courses yet</div>
          <p className="text-gray-600">Create your first course to get started</p>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;