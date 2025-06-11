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
import UserLayout from './user/layout/UserLayout';
import Profile from './user/pages/Profile';
import Skills from './user/pages/Skills';
import Projects from './user/pages/Projects';
import Tutorials from './user/pages/Tutorials';
import Internships from './user/pages/Internships';

function App() {

  return (
    <>
      <Router>
        <Routes>
    <Route path="" index element={<VideoAnalyticsTracker />} />
          <Route path='/user' element={<UserLayout />} >
          <Route path="profile" element={<Profile />} />
          <Route path="skills" element={<Skills />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tutorials" element={<Tutorials />} />
          <Route path="internships" element={<Internships />} />
          <Route path="*" element={<> No Routes Found</>} />

          
          </Route>
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
