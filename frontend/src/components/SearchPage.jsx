import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Download, Eye } from 'lucide-react';
import Navbar from './Navbar';
import { repositoryApi } from '../services/api';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const searchRepositories = async () => {
      try {
        setLoading(true);
        const query = searchParams.get('q') || '';
        const response = await repositoryApi.searchRepositories(query);
        setRepositories(response.data);
        console.log(response.data[0].owner._id);
      } catch (err) {
        setError(err.message || 'Failed to search repositories');
      } finally {
        setLoading(false);
      }
    };

    searchRepositories();
  }, [searchParams]);

  const handleDownload = async (repoId) => {
    try {
      await repositoryApi.downloadRepository(repoId);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Search Results for "{searchParams.get('q')}"
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          ) : repositories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No repositories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repositories.map((repo) => (
                <div key={repo._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Repository Image */}
                  <div className="relative h-48 bg-gray-200">
                    {repo.images && repo.images.length > 0 ? (
                      <img
                        src={repo.images[0].path}
                        alt={repo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Repository Content */}
                  <div className="p-4">
                    <div className="cursor-pointer flex items-center mb-2" onClick={() => window.location.href = `/public-profile/${repo.owner._id}`}>
                      <img
                        src={repo.owner.profilePicture}
                        alt={repo.owner.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">{repo.owner.name}</span>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-2 overflow-hidden line-clamp-1">{repo.title}</h2>
                    <p className="text-gray-600 text-sm mb-4 overflow-hidden line-clamp-1">{repo.description}</p>

                    {/* Action Buttons */}
                    <div className="flex justify-between">
                      <button
                        onClick={() => window.location.href = `/project/${repo._id}`}
                        className="cursor-pointer inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Project
                      </button>
                      <button
                        onClick={() => handleDownload(repo._id)}
                        className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchPage; 