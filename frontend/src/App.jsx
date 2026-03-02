import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import CreateRepo from './components/CreateRepo';
import ProjectView from './components/ProjectView';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import { getCurrentUser } from './services/api';
import EditProfile from './components/EditProfile';
import PublicProfile from './components/PublicProfile';
import EditProjectView from './components/EditProjectView';


function App() {

  return (   
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={getCurrentUser()}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/public-profile/:userId" element={<PublicProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create-repo" element={<CreateRepo />} />
          <Route path="/project/:id" element={<ProjectView />} />
          <Route path="/edit-project/:id" element={<EditProjectView />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;