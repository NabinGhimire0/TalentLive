import { useState } from "react";
import data from "./data.js"
import { CheckCircle, Play, Video } from "lucide-react";



const Tutorials = () => {
  const [watchingTutorial, setWatchingTutorial] = useState(null);
  const [watchProgress, setWatchProgress] = useState({});
const [tutorials, setTutorials] = useState(data.mockTutorials);
  const startWatching = (tutorial) => {
    setWatchingTutorial(tutorial);
    setWatchProgress({
      ...watchProgress,
      [tutorial.id]: tutorial.watched
    });
  };

  const updateProgress = (tutorialId, progress) => {
    setWatchProgress({
      ...watchProgress,
      [tutorialId]: progress
    });
  };

  const getProgressColor = (watched, duration) => {
    const percentage = (watched / duration) * 100;
    if (percentage === 100) return 'bg-green-500';
    if (percentage > 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span>;
      case 'In Progress':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">In Progress</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Not Started</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Learning Tutorials</h2>
        <div className="text-sm text-gray-600">
          Complete tutorials to earn MMR based on watch progress
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tutorials.map(tutorial => {
          const currentProgress = watchProgress[tutorial.id] || tutorial.watched;
          const progressPercentage = (currentProgress / tutorial.duration) * 100;
          
          return (
            <div key={tutorial.id} className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">{tutorial.title}</h3>
                <p className="text-gray-600 text-sm">Instructor: {tutorial.instructor}</p>
                <p className="text-gray-600 text-sm">Skill: {tutorial.skill}</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(currentProgress, tutorial.duration)}`}
                      style={{width: `${progressPercentage}%`}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {currentProgress} / {tutorial.duration} minutes watched
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">MMR Reward:</span>
                  <span className="text-sm font-medium text-green-600">+{tutorial.mmrReward}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
                  {getStatusBadge(tutorial.status)}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {tutorial.status !== 'Completed' && (
                  <button
                    onClick={() => startWatching(tutorial)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
                  >
                    <Play size={16} />
                    <span>{tutorial.status === 'Not Started' ? 'Start Tutorial' : 'Continue'}</span>
                  </button>
                )}
                
                {tutorial.status === 'Completed' && (
                  <button className="w-full bg-green-100 text-green-800 py-2 rounded-lg flex items-center justify-center space-x-2">
                    <CheckCircle size={16} />
                    <span>Completed</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {watchingTutorial && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Watching: {watchingTutorial.title}</h3>
            <div className="space-y-4">
              <div className="bg-gray-900 h-48 rounded-lg flex items-center justify-center">
                <Video className="text-white" size={48} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round((watchProgress[watchingTutorial.id] || watchingTutorial.watched) / watchingTutorial.duration * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={watchingTutorial.duration}
                  value={watchProgress[watchingTutorial.id] || watchingTutorial.watched}
                  onChange={(e) => updateProgress(watchingTutorial.id, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0:00</span>
                  <span>{Math.floor(watchingTutorial.duration / 60)}:{(watchingTutorial.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>MMR will be calculated based on actual watch time.</p>
                <p>Seeking reduces MMR gain by 50%.</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setWatchingTutorial(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Tutorials