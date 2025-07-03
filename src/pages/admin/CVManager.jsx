// src/pages/admin/CVManager.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  getAllCVs,
  uploadCV,
  updateCV,
  deleteCV,
  toggleCVActive,
  createDownloadLink
} from '../../services/cvApi';

const CVManager = () => {
  const { currentUser } = useAuth();
  const [cvs, setCvs] = useState([]);
  const [editCV, setEditCV] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      setIsLoading(true);
      const data = await getAllCVs();
      setCvs(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching CVs:', error);
      setError('Failed to load CVs. Please try again.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed for CV uploads');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '' });
    setSelectedFile(null);
    setEditCV(null);
    setError(null);
    setUploadProgress(0);
    document.getElementById('cv-file-input').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      if (editCV) {
        // Update existing CV (metadata only)
        await updateCV(editCV.id, formData);
        showSuccessMessage('CV updated successfully!');
      } else {
        // Upload new CV
        if (!selectedFile) {
          setError('Please select a PDF file to upload');
          setIsLoading(false);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('cv_file', selectedFile);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);

        await uploadCV(formDataToSend);
        showSuccessMessage('CV uploaded successfully!');
      }

      await fetchCVs();
      resetForm();
    } catch (error) {
      console.error('Error saving CV:', error);
      setError(error.response?.data?.error || 'Failed to save CV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (cv) => {
    setEditCV(cv);
    setFormData({
      title: cv.title,
      description: cv.description || ''
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also delete the file from the server.`)) {
      setIsLoading(true);
      try {
        await deleteCV(id);
        showSuccessMessage('CV deleted successfully!');
        await fetchCVs();
      } catch (error) {
        console.error('Error deleting CV:', error);
        setError('Failed to delete CV. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await toggleCVActive(id);
      showSuccessMessage(`CV ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
      await fetchCVs();
    } catch (error) {
      console.error('Error toggling CV status:', error);
      setError('Failed to update CV status. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">CV Manager</h1>
          <p className="text-gray-400">Upload, manage, and track downloads of your CV files</p>
        </div>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 border border-red-500/30"
          >
            {error}
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6 border border-green-500/30"
          >
            {successMessage}
          </motion.div>
        )}

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {editCV ? 'Edit CV' : 'Upload New CV'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                CV Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="e.g., Backend Developer CV - 2025"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="Brief description of this CV version..."
              />
            </div>

            {!editCV && (
              <div>
                <label htmlFor="cv-file-input" className="block text-sm font-medium text-gray-300 mb-2">
                  CV File (PDF) *
                </label>
                <input
                  id="cv-file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-accent file:hover:bg-accent/80"
                />
                <p className="text-sm text-gray-400 mt-2">
                  Only PDF files are allowed. Maximum size: 5MB
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-accent text-primary rounded-md hover:bg-accent/80 transition-colors disabled:opacity-50 font-medium"
              >
                {isLoading ? 'Processing...' : (editCV ? 'Update CV' : 'Upload CV')}
              </button>

              {editCV && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* CV List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Uploaded CVs</h2>

          {isLoading && cvs.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading CVs...</p>
            </div>
          ) : cvs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No CVs uploaded yet. Upload your first CV above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cvs.map((cv) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-primary/30 p-4 rounded-lg border border-gray-700 hover:border-accent/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{cv.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          cv.is_active
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {cv.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {cv.description && (
                        <p className="text-gray-300 mb-2">{cv.description}</p>
                      )}

                      <div className="text-sm text-gray-400 space-y-1">
                        <p>File: {cv.file_name}</p>
                        <p>Size: {formatFileSize(cv.file_size)}</p>
                        <p>Uploaded: {formatDate(cv.upload_date)}</p>
                        <p>Downloads: {cv.download_count}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                      <a
                        href={createDownloadLink(cv.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        Preview
                      </a>

                      <a
                        href={createDownloadLink(cv.id)}
                        download
                        className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        Download
                      </a>

                      <button
                        onClick={() => handleEdit(cv)}
                        className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleToggleActive(cv.id, cv.is_active)}
                        className={`px-3 py-2 rounded-md transition-colors text-sm ${
                          cv.is_active
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {cv.is_active ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        onClick={() => handleDelete(cv.id, cv.title)}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CVManager;