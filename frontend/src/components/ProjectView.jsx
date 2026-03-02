import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, File, EyeIcon,  X } from 'lucide-react';
import Navbar from './Navbar';
import ReadmeViewer from './ReadmeViewer';
import repositoryApi, { getCurrentUser } from '../services/api';
import { toast } from 'react-hot-toast';
import CADFileViewer from './CADFileViewer';
import ImageCarousel from './ImageCarousel';


function ProjectView() {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('readme'); // README is default tab
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileViewer, setShowFileViewer] = useState(false);
  
  const [showCadFileViewer, setShowCadFileViewer] = useState(false);
  const [selectedCadFile, setSelectedCadFile] = useState(null);
  
  const fetchRepo = async (id) => {
    try {
      const r = await repositoryApi.getRepository(id);     
      console.log(r.data.bom.rows.length); 
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
      setOwner(o.data);
      console.log(r.data.bom.rows?.values);
      
      
    } catch (error) {
      console.error('Error fetching repository:', error);
    }
  }

  const handleViewFile = (file) => {
    setSelectedFile(file);
    setShowFileViewer(true);
  };


  const handleDownloadFile = async (file) => {
    try {
      const response = await fetch(file.path);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleViewCADFile = (file) => {
    // Open CAD file in a new tab
    setSelectedCadFile(file);
    setShowCadFileViewer(true);
    //window.open(file.path, '_blank');
  };


  //Images section logic:
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // Close modal when clicking outside the image
  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };


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
              <div className="flex items-center space-x-2 cursor-pointer"  onClick={() => window.location.href = `/public-profile/${owner._id}`}>
                <img
                  src={owner?.profilePicture || 'https://via.placeholder.com/40'}
                  alt={owner?.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-gray-600" >by {owner?.name}</span>
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
              <h1 className='text-3xl font-bold text-gray-900 mb-10'>Project Preview</h1>
             
            <div className="h-auto">
              {/* {project.images.map((image, index) => (
                <div key={index} className="aspect-w-16 aspect-h-9">
                  <img
                    src={image.path}
                    alt={`Project image ${index + 1}`}
                    className="object-cover rounded-lg shadow"
                  />
                </div>
              ))} */}
              <ImageCarousel images={project.images} />
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
              onClick={() => setActiveTab('models')}
              className={`${
                activeTab === 'models'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer`}
            >
              3D Models
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
              
              {/* Document Files Section */}
              {project.files.docs && project.files.docs.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Documentation</h3>
                  <div className="space-y-2">
                    {project.files.docs.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                          {/* <span className="ml-2 text-sm text-gray-500">{file.size}</span> */}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewFile(file)}
                            className="p-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadFile(file)}
                            className="p-2 text-green-600 hover:text-green-800 cursor-pointer"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

           {/* 3D Files Section */}
           {activeTab === 'models' && (
            <div className='space-y-6'>
              {/* CAD Files Section */}
              {project.files.cad && project.files.cad.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">CAD Files</h3>
                  <div className="space-y-2">
                    {project.files.cad.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <File className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                          {/* <span className="ml-2 text-sm text-gray-500">{file.size}</span> */}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewCADFile(file)}
                            className="p-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadFile(file)}
                            className="p-2 text-green-600 hover:text-green-800 cursor-pointer"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
           )}

          {/* Images Section */}
          {activeTab === 'images' && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.images.map((image, index) => (
              <div 
                key={index} 
                className="aspect-w-16 aspect-h-9 cursor-pointer"
                onClick={() => openModal(image)}
              >
                <img
                  src={image.path}
                  alt={`Project image ${index + 1}`}
                  className="object-cover rounded-lg hover:opacity-90 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
    
          { selectedImage && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 cursor-pointer" 
              onClick={handleModalClick}
            >
              <div className="max-w-4xl max-h-screen p-4">
                <img
                  src={selectedImage.path}
                  alt="Enlarged view"
                  className="max-h-screen max-w-full object-contain rounded"
                />
                <button 
                  className="cursor-pointer absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 cursor-pointer"
                  onClick={closeModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
            </>
          )}

          {/* Bill of Materials Section */}
          {activeTab === 'bom' && (
            <div className="overflow-x-auto">
              {project.bom.rows.length >= 1 && (
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
                            { row.values && (
                              row.values[col.id]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* File Viewer Modal */}
          {showFileViewer && selectedFile && (
            <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-full h-full overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-medium">{selectedFile.name}</h3>
                  <button
                    onClick={() => setShowFileViewer(false)}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="h-full p-4">
                  {selectedFile.name.endsWith('.pdf') ? (
                    <iframe
                      src={selectedFile.path}
                      className="w-full h-full"
                      title={selectedFile.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Preview not available for this file type</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CAD File Viewer Modal */}
          {showCadFileViewer && selectedCadFile &&  activeTab == 'models' && (
            
            <div className='mt-10'>
              <div className="flex justify-between item-center p-4">
              <h2 className='text-xl font-bold'>{selectedCadFile.name}</h2>
              <button
                    onClick={() => setShowCadFileViewer(false)}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              <div className="bg-white rounded-lg w-full h-full overflow-hidden flex justify-center items-center">
                  <CADFileViewer file = {selectedCadFile}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default ProjectView; 