import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X, Settings, Delete, Trash, Trash2, Trash2Icon } from 'lucide-react';
import Navbar from './Navbar';

function CreateRepo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    readme: '',
    files: {
      cad: [],
      documentation: [],
      report: [],
      layout: [],
    },
    images: [],
    bom: {
      columns: [
        { id: 'component', label: 'Component', type: 'text' },
        { id: 'quantity', label: 'Quantity', type: 'number' },
        { id: 'price', label: 'Price', type: 'text' },
        { id: 'supplier', label: 'Supplier', type: 'text' },
      ],
      rows: [{ id: 1, values: {} }],
    },
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [showBomSettings, setShowBomSettings] = useState(false);
  const [newColumn, setNewColumn] = useState({ label: '', type: 'text' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Separate images and other files
    const images = files.filter(file => file.type.startsWith('image/'));
    const otherFiles = files.filter(file => !file.type.startsWith('image/'));

    // Update images
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...images]
    }));

    // Create preview URLs for images
    const newPreviews = images.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);

    // Update other files
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        cad: [...prev.files.cad, ...otherFiles]
      }
    }));
  };

  const removeFile = (index, isImage = false) => {
    if (isImage) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      URL.revokeObjectURL(previewImages[index]);
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setFormData(prev => ({
        ...prev,
        files: {
          ...prev.files,
          cad: prev.files.cad.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const addBomRow = () => {
    setFormData(prev => ({
      ...prev,
      bom: {
        ...prev.bom,
        rows: [...prev.bom.rows, { id: Date.now(), values: {} }]
      }
    }));
  };

  const removeBomRow = (rowId) => {
    setFormData(prev => ({
      ...prev,
      bom: {
        ...prev.bom,
        rows: prev.bom.rows.filter(row => row.id !== rowId)
      }
    }));
  };

  const addBomColumn = () => {
    if (!newColumn.label) return;

    setFormData(prev => ({
      ...prev,
      bom: {
        ...prev.bom,
        columns: [...prev.bom.columns, { id: newColumn.label.toLowerCase(), ...newColumn }],
        rows: prev.bom.rows.map(row => ({
          ...row,
          values: { ...row.values, [newColumn.label.toLowerCase()]: '' }
        }))
      }
    }));
    setNewColumn({ label: '', type: 'text' });
  };

  const removeBomColumn = (columnId) => {
    setFormData(prev => ({
      ...prev,
      bom: {
        ...prev.bom,
        columns: prev.bom.columns.filter(col => col.id !== columnId),
        rows: prev.bom.rows.map(row => {
          const newValues = { ...row.values };
          delete newValues[columnId];
          return { ...row, values: newValues };
        })
      }
    }));
  };

  const handleBomChange = (rowId, columnId, value) => {
    setFormData(prev => ({
      ...prev,
      bom: {
        ...prev.bom,
        rows: prev.bom.rows.map(row =>
          row.id === rowId
            ? { ...row, values: { ...row.values, [columnId]: value } }
            : row
        )
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to save project
    navigate('/profile');
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-9">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 pb-2">Create New Project</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 font-bold"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                required
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="readme" className="block text-sm font-medium text-gray-700">
                README Content
              </label>
              <textarea
                name="readme"
                id="readme"
                rows="6"
                required
                value={formData.readme}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                placeholder="# Project Title&#10;## Description&#10;## Installation&#10;## Usage"
              />
            </div>

            {/* Unified File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Files
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="sr-only"
                  id="project-files"
                />
                <label
                  htmlFor="project-files"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </label>
              </div>

              {/* File List */}
              <div className="mt-4 space-y-2">
                {formData.files.cad.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <File className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Image Previews</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index, true)}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bill of Materials */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Bill of Materials (Optional)</h2>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowBomSettings(!showBomSettings)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Columns
                  </button>
                  <button
                    type="button"
                    onClick={addBomRow}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Row
                  </button>
                </div>
              </div>

              {/* BOM Column Settings */}
              {showBomSettings && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Add New Column</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newColumn.label}
                      onChange={(e) => setNewColumn(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Column Name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                    />
                    <select
                      value={newColumn.type}
                      onChange={(e) => setNewColumn(prev => ({ ...prev, type: e.target.value }))}
                      className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                    </select>
                    <button
                      type="button"
                      onClick={addBomColumn}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* BOM Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      {formData.bom.columns.map((column) => (
                        <th
                          key={column.id}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.label}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.bom.rows.map((row) => (
                      <tr key={row.id}>
                        {formData.bom.columns.map((column) => (
                          <td key={column.id} className="px-4 py-2">
                            <input
                              type={column.type}
                              value={row.values[column.id] || ''}
                              onChange={(e) => handleBomChange(row.id, column.id, e.target.value)}
                              className="block p-2 w-full border-gray-600 rounded-md shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => removeBomRow(row.id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <Trash2Icon className="h-4 w-4 text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default CreateRepo; 