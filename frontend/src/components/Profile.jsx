import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Edit2, Trash2 } from 'lucide-react';
import repositoryApi, { getCurrentUser, logout } from '../services/api';
import Navbar from './Navbar';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        // console.log(userData._id);
        const userRepo = await repositoryApi.getUserRepositories();

        // console.log({
        //   "id": userRepo.data[0]._id,
        //   "title": userRepo.data[0].title,
        //   "description": userRepo.data[0].description,
        //   "image": userRepo.data[0].images[0].path
        // });

        setRepos(
          userRepo.data.map((repo) => ({
          id: repo._id ,
          title: repo.title ,
          description: repo.description ,
          image: repo.images?.[0]?.path || './mock/default.jpg', // Use default image if no image is found
          stars: repo.stars || 0, // Optional, set to 0 if not available
          downloads: repo.downloads || 0, // Optional, set to 0 if not available
        })))

        // TODO: Fetch user's repositories from API
        //For now, using mock data
        // setRepos([
        //   {
        //     id: 1,
        //     title: 'Smart Home Controller',
        //     description: 'An open-source home automation system built with Arduino.',
        //     image: './mock/project1.jfif',
        //     stars: 12,
        //     downloads: 45,
        //   },
        //   {
        //     id: 2,
        //     title: 'Weather Station',
        //     description: 'DIY weather station with temperature, humidity, and pressure sensors.',
        //     image: './mock/project2.jpg',
        //     stars: 8,
        //     downloads: 32,
        //   },
        // ]);
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                    <Edit2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600">@{user.username}</p>
                  <p className="text-gray-500">{user.occupation}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/create-repo')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Repo
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Repositories Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Repositories</h2>

            {repos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No repositories yet</p>
                <button
                  onClick={() => navigate('/create-repo')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Repository
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-w-16 aspect-h-9 h-48 object-cover">
                      <img
                        // src={require(`../mock/${repo.image}`)}
                        src={repo.image}
                        alt={repo.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{repo.title}</h3>
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-500">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{repo.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {repo.stars}
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                          </svg>
                          {repo.downloads}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/project/${repo.id}`)}
                        className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                      >
                        View Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile; 