import { Search } from "lucide-react";
import { useState } from "react";
import data from "./data.js"
const MentorStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
    const mockMentorData = data.mockMentorData;
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
export default MentorStudents