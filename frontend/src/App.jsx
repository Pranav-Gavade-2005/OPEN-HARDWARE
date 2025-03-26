import { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import CreateRepo from './components/CreateRepo';
import ProjectView from './components/ProjectView';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';



function App() {

  return (   
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-repo" element={<CreateRepo />} />
          <Route path="/project/:id" element={<ProjectView />} />
        </Routes>

        {/* Footer */}
        <Footer/>
      </div>
    </Router>
  );
}

export default App;