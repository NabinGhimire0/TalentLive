import React, { useEffect, useState } from 'react';
import {
    Save,
    X,
    Briefcase,
    Building,
    Calendar,
    FileText,
    User,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import Select from 'react-select';
import api from '../../../axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CreateWorkHistory = () => {
    // State Management
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        company_id: '',
        position: '',
        responsibilities: '',
        type: 'job',
        start_date: '',
        end_date: '',
        is_current: false
    });

    // Constants
    const WORK_TYPES = [
        { value: 'job', label: 'Job' },
        { value: 'internship', label: 'Internship' },
    ];

    // Effects
    useEffect(() => {
        fetchCompanies();
    }, []);

    // API Functions
    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const res = await api.get('api/companies');
            console.log('Companies data:', res.data.data);
            setCompanies(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch companies:', error);
            setCompanies([{ id: 0, name: "Error occurred while loading companies" }]);
            toast.error('Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitLoading(true);
        setError('');
        setSuccess(false);

        try {
            const dataToSend = {
                company_id: parseInt(formData.company_id),
                position: formData.position.trim(),
                responsibilities: formData.responsibilities.trim(),
                type: formData.type,
                start_date: formData.start_date,
                ...(formData.end_date && !formData.is_current && { end_date: formData.end_date })
            };

            console.log('Submitting data:', dataToSend);

            const response = await api.post('api/work-histories', dataToSend);

            if (response.data.success) {
                setSuccess(true);
                toast.success(response.data.message || 'Work history added successfully!');
                resetForm();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save work history';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Submit error:', err);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Helper Functions
    const validateForm = () => {
        if (!formData.company_id) {
            toast.error('Please select a company');
            return false;
        }
        if (!formData.position.trim()) {
            toast.error('Position is required');
            return false;
        }
        if (!formData.responsibilities.trim()) {
            toast.error('Responsibilities are required');
            return false;
        }
        if (!formData.start_date) {
            toast.error('Start date is required');
            return false;
        }
        if (!formData.is_current && formData.end_date && formData.end_date < formData.start_date) {
            toast.error('End date must be after start date');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setFormData({
            company_id: '',
            position: '',
            responsibilities: '',
            type: 'job',
            start_date: '',
            end_date: '',
            is_current: false
        });
    };

    const getCompanyOptions = () => {
        return companies.map(company => ({
            value: company.id,
            label: company.name
        }));
    };

    const getWorkTypeColor = (type) => {
        const colors = {
            job: 'bg-blue-100 text-blue-800',
            internship: 'bg-green-100 text-green-800',
            freelance: 'bg-purple-100 text-purple-800',
            contract: 'bg-orange-100 text-orange-800',
            'part-time': 'bg-yellow-100 text-yellow-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    // Event Handlers
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCompanyChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            company_id: selectedOption ? selectedOption.value : ''
        }));
    };

    const handleCurrentJobChange = (e) => {
        const isChecked = e.target.checked;
        setFormData(prev => ({
            ...prev,
            is_current: isChecked,
            end_date: isChecked ? '' : prev.end_date
        }));
    };

    // Custom Styles for React Select
    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
            minHeight: '48px',
            '&:hover': {
                borderColor: '#3b82f6'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#dbeafe' : 'white',
            color: state.isSelected ? 'white' : '#374151'
        })
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Add Work History</h1>
                                <p className="text-blue-100 mt-1">
                                    Add your professional experience and career milestones
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                                <CheckCircle size={20} />
                                <span>Work history has been successfully added!</span>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Company Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Company *
                                </label>
                                {/* <Select
                  options={getCompanyOptions()}
                  value={getCompanyOptions().find(option => option.value === formData.company_id)}
                  onChange={handleCompanyChange}
                  placeholder="Select a company..."
                  styles={selectStyles}
                  isLoading={loading}
                  noOptionsMessage={() => companies.length === 0 ? "No companies available" : "No options"}
                  className="react-select-container"
                  classNamePrefix="react-select"
                /> */}
                                <select
                                    name="company_id"
                                    id="company_id"
                                    value={formData.company_id}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    onChange={(e) =>
                                        setFormData({ ...formData, company_id: e.target.value })
                                    }
                                >
                                    <option value="">Select a company...</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>

                                <p className="text-xs text-gray-500 mt-1">
                                    Choose the company where you worked
                                </p>
                            </div>

                            {/* Position and Work Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Position/Job Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Senior Software Developer"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Work Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        {WORK_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Responsibilities */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Key Responsibilities *
                                </label>
                                <textarea
                                    name="responsibilities"
                                    value={formData.responsibilities}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    placeholder="Describe your main responsibilities and achievements in this role..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Include key achievements, projects, and daily responsibilities
                                </p>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleInputChange}
                                        disabled={formData.is_current}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Current Job Checkbox */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_current"
                                    name="is_current"
                                    checked={formData.is_current}
                                    onChange={handleCurrentJobChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_current" className="ml-2 block text-sm text-gray-700">
                                    I currently work here
                                </label>
                            </div>

                            {/* Work Type Preview */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Preview</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getWorkTypeColor(formData.type)}`}>
                                        {WORK_TYPES.find(t => t.value === formData.type)?.label}
                                    </span>
                                    <span className="text-gray-600">•</span>
                                    <span className="text-sm text-gray-700">
                                        {formData.position || 'Position'}
                                        {formData.company_id && companies.find(c => c.id === formData.company_id) &&
                                            ` at ${companies.find(c => c.id === formData.company_id).name}`
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <Link
                                    to={"/user/work-history"}
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center gap-2"
                                >
                                    <X size={16} />
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-lg hover:shadow-xl"
                                >
                                    {submitLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Add Work History
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkHistory;