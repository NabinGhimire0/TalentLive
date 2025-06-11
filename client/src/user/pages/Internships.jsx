import { useState } from "react";
import data from "./data"
import { Plus, Trash2 } from "lucide-react";

const Internships = () => {
    const [internships, setInternships] = useState(data.mockInternships);
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
        <div className="fixed inset-0  backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
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
export default Internships