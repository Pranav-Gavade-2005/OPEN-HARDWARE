import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, LogOut, Edit2, Trash2 } from 'lucide-react';
import repositoryApi, { deleteRepository, downloadFile, getCurrentUser, logout } from '../services/api';
import Navbar from './Navbar';
import { Toaster, toast} from 'sonner';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState(null);

  const location = useLocation();
  const fetchUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      console.log(userData);

      const userRepo = await repositoryApi.getUserRepositories();
      
      // console.log({
      //   "id": userRepo.data[0]._id,
      //   "title": userRepo.data[0].title,
      //   "description": userRepo.data[0].description,
      //   "image": userRepo.data[0].images[0].path
      // });

      setRepos(
        userRepo.data.map((repo) => ({
          id: repo._id,
          title: repo.title,
          description: repo.description,
          image: repo.images?.[0]?.path || './mock/default.jpg', // Use default image if no image is found
          stars: repo.stars || 0, // Optional, set to 0 if not available
          downloads: repo.downloads || 0, // Optional, set to 0 if not available
        })))


    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [location.key]);

  const handleDeleteClick = (repoId) => {
    setRepoToDelete(repoId);
    setShowDeleteModal(true);
   
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRepository(repoToDelete);
      setShowDeleteModal(false);
      setRepoToDelete(null);
      // Refresh repositories list
      await fetchUser();
      toast.success("The Repository is deleted successfully!");
    } catch (error) {
      console.error('Error deleting repository:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRepoToDelete(null);
  };

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     navigate('/login');
  //   } catch (error) {
  //     console.error('Error logging out:', error);
  //   }
  // };

  const handleDownload = async (repoId) => {
      try {
        await repositoryApi.downloadRepository(repoId);
      } catch (error) {
        console.error('Download failed:', error);
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
      {/* <Navbar /> */}
      <Toaster richColors/>
      <div className="min-h-screen bg-gray-50 pt-16 ">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-2 py-8 gap-8 flex flex-col sm:flex-row">
          {/* Profile Section*/}
          <div className="p-2 mb-6 sm:w-[40vw] mt-16">
            <div className="flex flex-col gap-10 w-[100%]">
              <div className="">
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={user.profilePicture || '/default-avatar.png'}
                      alt={user.name}
                      className="h-50 w-50 rounded-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="mt-10 text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600">@{user.username}</p>
                  <p className="text-gray-500">{user.occupation}</p>
                </div>
              </div>
              <div className="flex flex-col space-x-4 space-y-3">
                <button onClick={()=> {navigate('/edit-profile')}}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 cursor-pointer"
                >
                  Edit Profile
                </button>
                {/* <button
                  className="px-4 py-2 border-2 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 cursor-pointer"
                >
                  Follow 
                </button> */}
                <div className='text-left pb-3' >
                  <h2 className='text-lg font-bold'>TOTAL PROJECTS: {repos.length}</h2>
                  <div className="flex justify-between">
                  <h2 className='text-md '>Follwers: {repos?.follwers || 0}</h2>
                  <h2 className='text-md '>Following: {repos?.following || 0}</h2>
                  </div>
                </div>
                {/* <div className="flex items-denter space-x-4">
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
                </div> */}
              </div>
            </div>
          </div>

          {/* Repositories Section */}
          <div className="p-6">
            <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Projects</h2>
            <button
              onClick={() => navigate('/create-repo')}
              className="cursor-pointer flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Projects
            </button>
            </div>

            {repos.length === 0 ? (
              <div className="text-center py-1 w-100% sm:w-[55vw] h-[90vh] mt-50">
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
              <div className="grid grid-cols-1 gap-6 sm:w-[55vw] w-100%">
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
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
                        <h3 className="text-xl font-medium text-gray-900 overflow-hidden line-clamp-1">{repo.title}</h3>
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-blue-500 cursor-pointer" onClick={() => navigate(`/edit-project/${repo.id}`)}>
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-500 cursor-pointer" onClick={() => handleDeleteClick(repo.id)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 overflow-hidden line-clamp-1">{repo.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {repo.stars}
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 2a1 1 0 012 0v8h3a1 1 0 01.7 1.7l-4 4a1 1 0 01-1.4 0l-4-4A1 1 0 016 10h3V2zM4 16a1 1 0 100 2h12a1 1 0 100-2H4z" />
                          </svg>
                          {repo.downloads}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <button
                          onClick={() => navigate(`/project/${repo.id}`)}
                          className="mt-4 mr-3 w-full inline-flex items-center justify-center px-4 py-2 border-2 text-sm font-medium rounded-md text-dark bg-white hover:bg-gray-50 cursor-pointer"
                        >
                          View Project
                        </button>
                        <button
                          onClick={() => {handleDownload(repo.id)}}
                          className="mt-4 ml-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 cursor-pointer"
                        >
                          Download Project
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Repository
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this repository? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile; 