import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, File, WindArrowDownIcon } from 'lucide-react';
import Navbar from './Navbar';
import ReadmeViewer from './ReadmeViewer';
import repositoryApi, { getCurrentUser } from '../services/api';

function ProjectView() {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('readme'); // README is default tab

  const fetchRepo = async (id) => {
    try {
      const r = await repositoryApi.getRepository(id);
      //console.log(r.data);
      
      setProject({
        title: r.data.title,
        description: r.data.description,
        files: r.data.files,
        images: r.data.images,
        readme: r.data.readme,
        bom: r.data.bom,
        owner: r.data.owner // Add owner information
      });

      const o = await repositoryApi.getRepositoryOwner(r.data.owner);
      // console.log(o);
      setOwner(o.data);
      
      
    } catch (error) {
      console.error('Error fetching repository:', error);
    }
  }

  function handleDownloadFile(file) {
    window.location.assign(file.path);
  }

  useEffect(() => {
    fetchRepo(id);    
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <div className="flex items-center space-x-2">
                <img
                  src={owner?.profilePicture || 'https://via.placeholder.com/40'}
                  alt={owner?.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-gray-600">by {owner?.name}</span>
              </div>
            </div>
            {/* {project.images && project.images.length > 0 && (
              <div className="ml-6">
                <img
                  src={project.images[0].path}
                  alt="Project Preview"
                  className="h-32 w-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )} */}
          </div>
          <p className="mt-4 text-gray-600">{project.description}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className='text-3xl font-bold text-gray-900 mb-10'>IMAGES</h1>
             
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.map((image, index) => (
                <div key={index} className="aspect-w-16 aspect-h-9">
                  <img
                    src={image.path}
                    alt={`Project image ${index + 1}`}
                    className="object-cover rounded-lg shadow"
                  />
                </div>
              ))}
             </div>
   
        </div>


        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('readme')}
              className={`${
                activeTab === 'readme'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer`}
            >
              README
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`${
                activeTab === 'files'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer`}
            >
              Files
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`${
                activeTab === 'images'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer`}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab('bom')}
              className={`${
                activeTab === 'bom'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer`}
            >
              Bill of Materials
            </button>
          </nav>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* README Section */}
          {activeTab === 'readme' && (
            <div className="prose max-w-none">
              <ReadmeViewer content={project.readme} />
            </div>
          )}

          {/* Files Section */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              {project.files.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Files</h3>
                  <div className="space-y-2">
                    {project.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                          <span className="ml-2 text-sm text-gray-500">{file.size}</span>
                        </div>
                        <button 
                          className="text-gray-600 hover:text-gray-900" 
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Images Section */}
          {activeTab === 'images' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.map((image, index) => (
                <div key={index} className="aspect-w-16 aspect-h-9">
                  <img
                    src={image.path}
                    alt={`Project image ${index + 1}`}
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Bill of Materials Section */}
          {activeTab === 'bom' && (
            <div className="overflow-x-auto">
              {project.bom.rows.length > 1 && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      {project.bom.columns.map((col) => (
                        <th key={col.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {project.bom.rows.map((row) => (
                      <tr key={row.id} className="border-b border-gray-200">
                        {project.bom.columns.map((col) => (
                          <td key={col.id} className="px-4 py-2 text-sm text-gray-700">
                            {row.values[col.id]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default ProjectView; 