import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MentorLayout from './mentor/layout/MentorLayout';
import HomePage from './pages/HomePage';

function App() {

  return (
    <>
      <Router>
        <Routes>

          <Route path="/" element={<HomePage />} />
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
