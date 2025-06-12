import React, { useState } from 'react';
import data from './data';
import { CheckCircle } from 'lucide-react';

const SkillVerification = () => {
  const mockMentorData = data.mockMentorData;
    return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Skill Verification</h1>
        <p className="text-gray-600 mt-1">Review and verify student skill claims</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Verifications</h3>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Approve All
            </button>
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
              Filter
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mockMentorData.skillRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {request.student.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{request.student}</h4>
                    <p className="text-sm text-gray-600">Submitted {request.submitted}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{request.skill}</p>
                  <p className="text-sm text-gray-600">Level: {request.level}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1">
                  <span>Reject</span>
                </button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                  Request Evidence
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillVerification;