import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, File, EyeIcon, X, Save, Edit, Plus, Trash2 } from 'lucide-react';
import Navbar from './Navbar';
import ReadmeViewer from './ReadmeViewer';
import repositoryApi, { getCurrentUser, updateRepository } from '../services/api';
import { toast } from 'react-hot-toast';
import CADFileViewer from './CADFileViewer';
import ImageCarousel from './ImageCarousel';

function EditProjectView() {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('readme');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileViewer, setShowFileViewer] = useState(false);
  
  const [showCadFileViewer, setShowCadFileViewer] = useState(false);
  const [selectedCadFile, setSelectedCadFile] = useState(null);
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [editingReadme, setEditingReadme] = useState(false);
  
  // Files management
  const [filesToUpload, setFilesToUpload] = useState({
    docs: [],
    cad: []
  });
  const [filesToDelete, setFilesToDelete] = useState({
    docs: [],
    cad: [],
  });
  
  // Image management
  const [imagesToUpload, setImagesToUpload] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  
  const fetchRepo = async (id) => {
    try {
      const r = await repositoryApi.getRepository(id);     
      console.log(r.data.bom.rows.length); 
      const projectData = {
        title: r.data.title,
        description: r.data.description,
        files: r.data.files,
        images: r.data.images,
        readme: r.data.readme,
        bom: r.data.bom,
        owner: r.data.owner
      };
      
      setProject(projectData);
      setEditedProject(JSON.parse(JSON.stringify(projectData))); // Deep copy for editing

      const o = await repositoryApi.getRepositoryOwner(r.data.owner);
      setOwner(o.data);
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
    setSelectedCadFile(file);
    setShowCadFileViewer(true);
  };

  // Images section logic
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Edit mode handlers
  const toggleEditMode = () => {
    if (isEditMode) {
      // Exiting edit mode without saving
      setEditedProject(JSON.parse(JSON.stringify(project))); // Reset to original
      setFilesToUpload({ docs: [], cad: [] });
      setFilesToDelete({ docs: [], cad: [] });
      setImagesToUpload([]);
      setImagesToDelete([]);
      setEditingReadme(false);
    }
    setIsEditMode(!isEditMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReadmeChange = (e) => {
    setEditedProject(prev => ({
      ...prev,
      readme: e.target.value
    }));
  };

  const handleFileUpload = (type, e) => {
    const files = Array.from(e.target.files);
    setFilesToUpload(prev => ({
      ...prev,
      [type]: [...prev[type], ...files]
    }));
  };

  const handleFileDelete = (type, file) => {
    // If it's a new file, remove from upload list
    if (!file.path) {
      setFilesToUpload(prev => ({
        ...prev,
        [type]: prev[type].filter(f => f !== file)
      }));
      return;
    }
    
    // Otherwise, mark for deletion and remove from UI
    setFilesToDelete(prev => ({
      ...prev,
      [type]: [...prev[type], file]
    }));
    
    setEditedProject(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [type]: prev.files[type].filter(f => f !== file)
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImagesToUpload(prev => [...prev, ...files]);
  };

  const handleImageDelete = (image) => {
    // If it's a new image, remove from upload list
    if (!image.path) {
      setImagesToUpload(prev => prev.filter(img => img !== image));
      return;
    }
    
    // Otherwise, mark for deletion and remove from UI
    setImagesToDelete(prev => [...prev, image]);
    setEditedProject(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image)
    }));
  };

  const saveChanges = async () => {
    try {
      // Create FormData to handle files
      const formData = new FormData();
      
      // Add project metadata
      formData.append('title', editedProject.title);
      formData.append('description', editedProject.description);
      formData.append('readme', editedProject.readme);
      
      // Add files to upload
      filesToUpload.docs.forEach(file => {
        formData.append('docs', file);
      });
      
      filesToUpload.cad.forEach(file => {
        formData.append('cad', file);
      });
      
      // Add images to upload
      imagesToUpload.forEach(image => {
        formData.append('images', image);
      });
      
      // Add files/images to delete
      formData.append('filesToDelete', JSON.stringify({
        docs: filesToDelete.docs.map(f => f.path),
        cad: filesToDelete.cad.map(f => f.path),
        images: imagesToDelete.map(img => img.path)
      }));
      
      // formData.append('imagesToDelete', JSON.stringify(
      //   imagesToDelete.map(img => img.path)
      // ));
      
    //   for (const value of formData.values()) {
    //     console.log(value);
    //   }

      // Save changes to API
      const res = await updateRepository(id, formData);
      
      // Refresh data
      await fetchRepo(id);
      
      // Exit edit mode
      setIsEditMode(false);
      setFilesToUpload({ docs: [], cad: [] });
      setFilesToDelete({ docs: [], cad: [] });
      setImagesToUpload([]);
      setImagesToDelete([]);
      
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Error updating repository:', error);
      toast.error('Failed to update project');
    }
  };

  useEffect(() => {
    fetchRepo(id);    
  }, [id]);

  if (!project || !editedProject) {
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
      <div className="flex justify-end mb-4">
              {isEditMode ? (
                <>
                  <button
                    onClick={saveChanges}
                    className="px-4 py-2 bg-green-600 shadow text-white rounded-md hover:bg-green-700 flex items-center cursor-pointer mr-3"
                  >
                    <Save className="h-4 w-4 mr-1" /> Save
                  </button>
                  <button
                    onClick={toggleEditMode}
                    className="px-4 py-2 bg-gray-500 shadow text-white rounded-md hover:bg-gray-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleEditMode}
                  className="px-4 py-2 bg-blue-600 shadow text-white rounded-md hover:bg-blue-700 flex items-center cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit Project
                </button>
              )}
            </div>


        {/* Project Header with Edit Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              {isEditMode ? (
                <input
                  type="text"
                  name="title"
                  value={editedProject.title}
                  onChange={handleInputChange}
                  className="text-3xl font-bold text-gray-900 mb-2 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              )}
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href = `/public-profile/${owner._id}`}>
                <img
                  src={owner?.profilePicture || 'https://via.placeholder.com/40'}
                  alt={owner?.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-gray-600">by {owner?.name}</span>
              </div>
            </div>
            
          </div>
          {isEditMode ? (
            <textarea
              name="description"
              value={editedProject.description}
              onChange={handleInputChange}
              className="mt-4 text-gray-600 w-full border rounded-md p-2 h-24 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <p className="mt-4 text-gray-600">{project.description}</p>
          )}
        </div>
        
        {/* Project Preview Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className='text-3xl font-bold text-gray-900'>Project Preview</h1>
            {isEditMode && (
              <div className="flex items-center">
                <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                  <Plus className="h-4 w-4 mr-1" /> Add Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>
          
          {isEditMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Display existing images */}
              {editedProject.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.path}
                    alt={`Project image ${index + 1}`}
                    className="object-cover rounded-lg w-full aspect-video"
                  />
                  <button
                    onClick={() => handleImageDelete(image)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {/* Display new images */}
              {imagesToUpload.map((image, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`New image ${index + 1}`}
                    className="object-cover rounded-lg w-full aspect-video"
                  />
                  <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                    New
                  </div>
                  <button
                    onClick={() => handleImageDelete(image)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-auto">
              <ImageCarousel images={project.images}/>
            </div>
          )}
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
              {isEditMode ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">README</h2>
                    <div className="flex space-x-2">
                      {!editingReadme ? (
                        <button
                          onClick={() => setEditingReadme(true)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit README
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingReadme(false)}
                          className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 cursor-pointer"
                        >
                          Preview
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {editingReadme ? (
                    <textarea
                      value={editedProject.readme}
                      onChange={handleReadmeChange}
                      className="w-full h-96 p-4 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <ReadmeViewer content={editedProject.readme} />
                  )}
                </div>
              ) : (
                <ReadmeViewer content={project.readme} />
              )}
            </div>
          )}

          {/* Files Section */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              {/* Document Files Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Documentation</h3>
                  {isEditMode && (
                    <label className="cursor-pointer px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center">
                      <Plus className="h-4 w-4 mr-1" /> Add Files
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload('docs', e)}
                      />
                    </label>
                  )}
                </div>
                
                <div className="space-y-2">
                  {/* Existing files */}
                  {(isEditMode ? editedProject.files.docs : project.files.docs)?.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{file.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        {!isEditMode ? (
                          <>
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
                          </>
                        ) : (
                          <button
                            onClick={() => handleFileDelete('docs', file)}
                            className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* New files to upload */}
                  {isEditMode && filesToUpload.docs.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-400 mr-2" />
                        <span className="text-sm text-blue-900">{file.name}</span>
                        <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">New</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFileDelete('docs', file)}
                          className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3D Files Section */}
          {activeTab === 'models' && (
            <div className='space-y-6'>
              {/* CAD Files Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">CAD Files</h3>
                  {isEditMode && (
                    <label className="cursor-pointer px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center">
                      <Plus className="h-4 w-4 mr-1" /> Add CAD Files
                      <input
                        type="file"
                        multiple
                        accept=".stl,.obj,.step,.stp,.iges,.igs"
                        className="hidden"
                        onChange={(e) => handleFileUpload('cad', e)}
                      />
                    </label>
                  )}
                </div>
                
                <div className="space-y-2">
                  {/* Existing CAD files */}
                  {(isEditMode ? editedProject.files.cad : project.files.cad)?.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <File className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{file.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        {!isEditMode ? (
                          <>
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
                          </>
                        ) : (
                          <button
                            onClick={() => handleFileDelete('cad', file)}
                            className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* New CAD files to upload */}
                  {isEditMode && filesToUpload.cad.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <File className="h-5 w-5 text-blue-400 mr-2" />
                        <span className="text-sm text-blue-900">{file.name}</span>
                        <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">New</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFileDelete('cad', file)}
                          className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CAD File Viewer */}
              {showCadFileViewer && selectedCadFile && (
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
                    <CADFileViewer file={selectedCadFile}/>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Images Section */}
          {activeTab === 'images' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Project Images</h3>
                {isEditMode && (
                  <label className="cursor-pointer px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center">
                    <Plus className="h-4 w-4 mr-1" /> Add Images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              
              {isEditMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Display existing images */}
                  {editedProject.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.path}
                        alt={`Project image ${index + 1}`}
                        className="object-cover rounded-lg w-full aspect-video"
                      />
                      <button
                        onClick={() => handleImageDelete(image)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Display new images */}
                  {imagesToUpload.map((image, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New image ${index + 1}`}
                        className="object-cover rounded-lg w-full aspect-video"
                      />
                      <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                        New
                      </div>
                      <button
                        onClick={() => handleImageDelete(image)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="aspect-w-16 aspect-h-9 cursor-pointer cursor-pointer"
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
              )}
            
              {/* Image Modal for view mode */}
              {selectedImage && !isEditMode && (
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
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Bill of Materials Section (Read-only) */}
          {activeTab === 'bom' && (
            <div className="overflow-x-auto">
              {project.bom.rows.length >= 1 && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Bill of Materials</h3>
                    {isEditMode && (
                      <div className="text-sm text-gray-500 italic">
                        BOM editing is not available in this view
                      </div>
                    )}
                  </div>
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
                </>
              )}
            </div>
          )}

          {/* File Viewer Modal */}
          {showFileViewer && selectedFile && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-medium">{selectedFile.name}</h3>
                  <button
                    onClick={() => setShowFileViewer(false)}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="h-[calc(100%-4rem)] p-4 overflow-auto">
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
        </div>
      </div>
    </div>
    </>
  );
}

export default EditProjectView;