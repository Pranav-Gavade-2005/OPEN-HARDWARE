import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import { getCurrentUser } from './services/api';
import CreateRepo from './components/CreateRepo';
import ProjectView from './components/ProjectView';

function Navbar({ isAuthenticated, user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              OpenHardware
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2">
                  <img
                    src={user?.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                  <span className="text-gray-600">{user?.name}</span>
                </Link>
              </>
            ) : (
              <>
                <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
                <a href="#projects" className="text-gray-600 hover:text-gray-900">Projects</a>
                <a href="#community" className="text-gray-600 hover:text-gray-900">Community</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                <img
                  src={user?.profilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
                <span>{user?.name}</span>
              </Link>
            ) : (
              <>
                <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</a>
                <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-gray-900">About</a>
                <a href="#projects" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Projects</a>
                <a href="#community" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Community</a>
                <a href="#contact" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Contact</a>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar isAuthenticated={isAuthenticated} user={user} />
        <Routes>
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <section className="relative bg-white overflow-hidden min-h-screen flex items-center pt-16">
                <div className="max-w-7xl mx-auto w-full">
                  <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                      <div className="sm:text-center lg:text-left">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                          <span className="block">Welcome to</span>
                          <span className="block">OpenHardware</span>
                        </h1>
                        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                          Empowering innovation through open-source hardware solutions. Join our community of makers, developers, and enthusiasts.
                        </p>
                        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                          <div className="rounded-md shadow">
                            <Link
                              to={isAuthenticated ? "/profile" : "/login"}
                              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 md:py-4 md:text-lg md:px-10"
                            >
                              {isAuthenticated ? "Go to Profile" : "Get Started"}
                              <ChevronRight className="ml-2" size={20} />
                            </Link>
                          </div>
                          <div className="mt-3 sm:mt-0 sm:ml-3">
                            <a href="#learn-more" className="w-full flex items-center justify-center px-8 py-3 border border-gray-900 text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                              Learn More
                            </a>
                          </div>
                        </div>
                      </div>
                    </main>
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section id="features" className="min-h-screen bg-gray-50 flex items-center py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="lg:text-center">
                    <h2 className="text-base text-gray-900 font-semibold tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                      Everything you need to get started
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                      Discover our comprehensive suite of tools and resources designed to help you succeed in your hardware projects.
                    </p>
                  </div>

                  <div className="mt-10">
                    <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                      {/* Feature 1 */}
                      <div className="relative">
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="ml-16">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Fast Development</h3>
                          <p className="mt-2 text-base text-gray-500">
                            Rapid prototyping and development tools to bring your ideas to life quickly.
                          </p>
                        </div>
                      </div>

                      {/* Feature 2 */}
                      <div className="relative">
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </div>
                        <div className="ml-16">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Customizable</h3>
                          <p className="mt-2 text-base text-gray-500">
                            Fully customizable components to match your specific needs and requirements.
                          </p>
                        </div>
                      </div>

                      {/* Feature 3 */}
                      <div className="relative">
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-16">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Community Driven</h3>
                          <p className="mt-2 text-base text-gray-500">
                            Join a thriving community of developers and makers sharing knowledge and resources.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section id="about" className="min-h-screen bg-white flex items-center py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="lg:text-center">
                    <h2 className="text-base text-gray-900 font-semibold tracking-wide uppercase">About Us</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                      Our Mission
                    </p>
                  </div>
                  <div className="mt-10">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="bg-gray-50 p-8 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Who We Are</h3>
                        <p className="text-gray-600">
                          OpenHardware is a community-driven platform dedicated to making hardware development accessible to everyone. 
                          We believe in the power of open-source collaboration and the potential of shared knowledge to drive innovation.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-8 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
                        <p className="text-gray-600">
                          We envision a world where hardware development is as accessible as software development, 
                          where anyone with an idea can bring it to life through our platform and community support.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Projects Section */}
              <section id="projects" className="min-h-screen bg-gray-50 flex items-center py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="lg:text-center">
                    <h2 className="text-base text-gray-900 font-semibold tracking-wide uppercase">Featured Projects</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                      Community Showcase
                    </p>
                  </div>
                  <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Project 1 */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        <div className="w-full h-48 bg-gray-300"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900">Smart Home Controller</h3>
                        <p className="mt-2 text-gray-600">An open-source home automation system built with our platform.</p>
                      </div>
                    </div>
                    {/* Project 2 */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        <div className="w-full h-48 bg-gray-300"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900">Environmental Monitor</h3>
                        <p className="mt-2 text-gray-600">Track and analyze environmental data with this community project.</p>
                      </div>
                    </div>
                    {/* Project 3 */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        <div className="w-full h-48 bg-gray-300"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900">Robotics Platform</h3>
                        <p className="mt-2 text-gray-600">A modular robotics platform for educational and research purposes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Community Section */}
              <section id="community" className="min-h-screen bg-white flex items-center py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="lg:text-center">
                    <h2 className="text-base text-gray-900 font-semibold tracking-wide uppercase">Community</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                      Join Our Growing Community
                    </p>
                  </div>
                  <div className="mt-10">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="bg-gray-50 p-8 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Community Benefits</h3>
                        <ul className="space-y-4 text-gray-600">
                          <li>• Access to exclusive resources and documentation</li>
                          <li>• Regular community meetups and workshops</li>
                          <li>• Mentorship opportunities</li>
                          <li>• Project collaboration possibilities</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-8 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Get Involved</h3>
                        <p className="text-gray-600 mb-4">
                          Whether you're a beginner or an experienced developer, there's a place for you in our community.
                        </p>
                        <Link
                          to="/login"
                          className="inline-flex items-center px-6 py-3 border border-gray-900 text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50"
                        >
                          Join Now
                          <ChevronRight className="ml-2" size={20} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section id="contact" className="min-h-screen bg-gray-50 flex items-center py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="lg:text-center">
                    <h2 className="text-base text-gray-900 font-semibold tracking-wide uppercase">Contact</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                      Get in Touch
                    </p>
                  </div>
                  <div className="mt-10 max-w-xl mx-auto">
                    <form className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                          name="message"
                          id="message"
                          rows="4"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                        ></textarea>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        >
                          Send Message
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-repo" element={<CreateRepo />} />
          <Route path="/project/:id" element={<ProjectView />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; 2024 OpenHardware. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;