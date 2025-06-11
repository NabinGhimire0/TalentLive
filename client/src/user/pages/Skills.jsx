import { useState } from "react";
import data from "./data.js"
import { CheckCircle, Plus, Trash2 } from "lucide-react";
const Skills = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: '', level: 'Beginner' });
const  [ skills, setSkills ] =useState(data.mockSkills)
const [ projects, setProjects ] = useState(data.mockProjects)

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
        <div className="fixed inset-0  backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
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

export default Skills