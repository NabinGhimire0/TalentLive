import { Edit, Trophy, User } from "lucide-react";
import data from "./data.js"
import { useState } from "react";
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = data.user
  const [editedUser, setEditedUser] = useState(user);
  const saveProfile = () => {
    // In a real app, this would update the user data
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <User size={40} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Trophy className="text-yellow-500" size={16} />
              <span className="font-medium"> {user.rank}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Personal Information</h4>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <Edit size={16} />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded-lg">{user.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded-lg">{user.email}</p>
              )}
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-6 flex space-x-3">
              <button
                onClick={saveProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        <div className="border-t pt-6 mt-6">
          <h4 className="text-lg font-medium mb-4">Account Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{user.mmr}</div>
              <div className="text-sm text-gray-600">Total MMR</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-gray-600">Skills</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Tutorials</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default  Profile