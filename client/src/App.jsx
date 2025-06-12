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
import MentorStudents from './mentor/pages/MentorStudents';
import MentorTutorials from './mentor/pages/MentorTutorials';
import SkillVerification from './mentor/pages/SkillVerification';
import MentorAnalytics from './mentor/pages/MentorAnalytics';
import CategoriesManager from './mentor/pages/CategoriesManager';
import SkillsManager from './mentor/pages/SkillManager';
import CreateProject from './user/pages/createProject';
import AllWorkHistory from './user/pages/workhistory/AllWorkHistory';
import CreateWorkHistory from './user/pages/workhistory/CreateWorkHistory';
import WatchVideos from './user/pages/WatchVideos';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourcesDetails from './pages/CourcesDetails';
import Contacts from './pages/Contacts';
import ProfilesPage from './pages/ProfilesPage';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="" index element={<HomePage  />} />
          <Route path="/courses" index element={<CoursesPage  />} />
          <Route path="/user-profile" index element={<ProfilesPage  />} />
          <Route path="/contact" index element={<Contacts/>} />
          <Route path="/courses/:id" index element={<CourcesDetails  />} />

          <Route path='/user' element={<UserLayout />} >
            <Route path="profile" element={<Profile />} />
            <Route path="skills" element={<Skills />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/create" element={<CreateProject />} />
            <Route path="tutorials" element={<Tutorials />} />
            <Route path="tutorials/:id" element={<WatchVideos />} />
            <Route path="work-history" element={<AllWorkHistory />} />
            <Route path="work-history/create" element={<CreateWorkHistory />} />

            <Route path="internships" element={<Internships />} />
            <Route path="*" element={<> No Routes Found</>} />


          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/mentor" element={<MentorLayout />}>

          <Route path="" index element={<MentorAnalytics  />} />
          <Route path="courses" index element={<MentorAnalytics  />} />
          <Route path="categories" element={<CategoriesManager  />} />
          <Route path="skills" element={<SkillsManager  />} />

          <Route path="students" element={<MentorStudents />} />
          <Route path="tutorials" element={<MentorTutorials  />} />
          <Route path="skill-verification" element={<SkillVerification  />} />
          <Route path="analytics" element={<MentorAnalytics   />} />
            <Route path="*" element={<>dwla</>} />
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
