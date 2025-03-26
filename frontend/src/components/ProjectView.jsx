import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, File } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Navbar from './Navbar';

function ProjectView() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('files');

  useEffect(() => {
    // TODO: Fetch project data from API
    // This is mock data for now
    setProject({
      title: 'Smart Home Controller',
      description: 'An open-source home automation system built with Arduino.',
      files: {
        cad: [{ name: 'enclosure.stl', size: '2.5MB' }],
        documentation: [{ name: 'setup_guide.pdf', size: '1.2MB' }],
        report: [{ name: 'technical_report.pdf', size: '3.1MB' }],
        layout: [{ name: 'pcb_design.zip', size: '5.4MB' }],
      },
      images: [
        './mock/project1.jfif',
        './mock/project2.jpg',
      ],
      readme: `# Smart Home Controller\n\n## Description\nThis project is an open-source home automation system...\n\n## Installation\n1. Clone the repository\n2. Install dependencies\n3. Upload firmware\n\n## Usage\nFollow these steps to set up your controller...`,
      bom: [
        { component: 'Arduino Nano', quantity: '1', price: '$4.00', supplier: 'Example Store' },
        { component: 'Relay Module', quantity: '4', price: '$2.50', supplier: 'Example Store' },
      ],
    });
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
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <p className="mt-2 text-gray-600">{project.description}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('files')}
              className={`${
                activeTab === 'files'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Files
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`${
                activeTab === 'images'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab('readme')}
              className={`${
                activeTab === 'readme'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              README
            </button>
            <button
              onClick={() => setActiveTab('bom')}
              className={`${
                activeTab === 'bom'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Bill of Materials
            </button>
          </nav>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Files Section */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              {/* CAD Files */}
              {project.files.cad.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">CAD Files</h3>
                  <div className="space-y-2">
                    {project.files.cad.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                          <span className="ml-2 text-sm text-gray-500">{file.size}</span>
                        </div>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documentation Files */}
              {project.files.documentation.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Documentation</h3>
                  <div className="space-y-2">
                    {project.files.documentation.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <File className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                          <span className="ml-2 text-sm text-gray-500">{file.size}</span>
                        </div>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Report Files */}
              {project.files.report.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Reports</h3>
                  <div className="space-y-2">
                    {project.files.report.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <File className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                          <span className="ml-2 text-sm text-gray-500">{file.size}</span>
                        </div>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Files */}
              {project.files.layout.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Layout Files</h3>
                  <div className="space-y-2">
                    {project.files.layout.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <File className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                          <span className="ml-2 text-sm text-gray-500">{file.size}</span>
                        </div>
                        <button className="text-gray-600 hover:text-gray-900">
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
                    src={'./mock/project1.jfif'}
                    alt={`Project image ${index + 1}`}
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* README Section */}
          {activeTab === 'readme' && (
            <div className="prose max-w-none">
              <ReactMarkdown>{project.readme}</ReactMarkdown>
            </div>
          )}

          {/* Bill of Materials Section */}
          {activeTab === 'bom' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Component
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {project.bom.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.component}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.price}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.supplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default ProjectView; 