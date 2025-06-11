import './App.css'
import Login from './pages/Login'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MentorLayout from './mentor/layout/MentorLayout';

import UserDashboard from './pages/UserDashboard';
import VideoAnalyticsTracker from './components/VideoAnalyticsTracker';

function App() {

  return (
    <>
      <Router>
        <Routes>
    <Route path="" index element={<VideoAnalyticsTracker />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mentor" element={<MentorLayout />}>
            <Route path="*" element={<>dwla</>} />
          </Route>
          
        </Routes>
      </Router>
    </>
  )
}

export default App
