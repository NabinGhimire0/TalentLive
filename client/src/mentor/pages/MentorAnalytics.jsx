import { Award, BarChart3, Calendar, PieChart, Star, TrendingUp, Users } from "lucide-react";
import data from "./data.js"
const MentorAnalytics = () => {
    const mockMentorData  = data.mockMentorData
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
export default MentorAnalytics