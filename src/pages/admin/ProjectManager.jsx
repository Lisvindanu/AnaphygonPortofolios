// src/pages/admin/ProjectManager.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject
} from '../../services/api';
import ImageUpload from '../../components/common/ImageUpload';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    images: '',
    tags: '',
    url: '',
    github_url: '',
    featured: false,
    order_index: 0
  });
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [editProject, setEditProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllProjects();
      setProjects(response);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      images: '',
      tags: '',
      url: '',
      github_url: '',
      featured: false,
      order_index: 0
    });
    setSelectedThumbnail(null);
    setSelectedImages([]);
    setEditProject(null);
    setError(null);
    setSuccessMessage('');
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      thumbnail: project.thumbnail || '',
      images: project.images || '',
      tags: project.tags || '',
      url: project.url || '',
      github_url: project.github_url || '',
      featured: project.featured === 1,
      order_index: project.order_index || 0
    });
    setSelectedThumbnail(null);
    setSelectedImages([]);
    setError(null);
    setSuccessMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        showSuccessMessage('Project deleted successfully!');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Failed to delete project. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;

    let finalValue;
    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'number') {
      finalValue = parseInt(value, 10) || 0;
    } else {
      finalValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleThumbnailSelect = (file) => {
    if (file) {
      setSelectedThumbnail(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, thumbnail: previewUrl }));
    } else {
      setSelectedThumbnail(null);
      setFormData(prev => ({ ...prev, thumbnail: '' }));
    }
  };

  const handleImagesSelect = (files) => {
    if (files && files.length > 0) {
      setSelectedImages(files);
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: previewUrls.join(',') }));
    } else {
      setSelectedImages([]);
      setFormData(prev => ({ ...prev, images: '' }));
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const submissionData = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'thumbnail' && key !== 'images') {
          submissionData.append(key, formData[key]);
        }
      });

      // Add thumbnail file if selected
      if (selectedThumbnail) {
        submissionData.append('thumbnail', selectedThumbnail);
      }

      // Add image files if selected
      if (selectedImages.length > 0) {
        selectedImages.forEach(file => {
          submissionData.append('images', file);
        });
      }

      if (editProject) {
        await updateProject(editProject.id, submissionData);
        showSuccessMessage('Project updated successfully!');
      } else {
        await createProject(submissionData);
        showSuccessMessage('New project added successfully!');
      }

      await fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
      setError(error.message || 'Failed to save project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openImagePreview = (images, startIndex = 0) => {
    if (!images) return;

    const imageArray = images.split(',').filter(Boolean).map(img => getImageUrl(img.trim()));
    setPreviewImages(imageArray);
    setCurrentImageIndex(startIndex);
    setShowImagePreview(true);
  };

  const closeImagePreview = () => {
    setShowImagePreview(false);
    setPreviewImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
        prev === previewImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
        prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };

  if (isLoading && projects.length === 0) {
    return (
        <div className="min-h-screen bg-primary text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-xl">Loading projects...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-primary text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Project Manager</h1>

            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                  <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200"
                  >
                    {successMessage}
                  </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                  <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200"
                  >
                    {error}
                  </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary rounded-lg p-6 mb-8"
            >
              <h2 className="text-xl font-semibold mb-6">
                {editProject ? 'Edit Project' : 'Add New Project'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Project Title</label>
                  <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-primary border border-gray-600 rounded-md focus:border-accent focus:outline-none"
                      placeholder="Enter project title"
                      required
                  />
                </div>

                {/* Project URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project URL</label>
                    <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-primary border border-gray-600 rounded-md focus:border-accent focus:outline-none"
                        placeholder="https://your-project.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                    <input
                        type="url"
                        name="github_url"
                        value={formData.github_url}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-primary border border-gray-600 rounded-md focus:border-accent focus:outline-none"
                        placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (Comma-separated)</label>
                  <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-primary border border-gray-600 rounded-md focus:border-accent focus:outline-none"
                      placeholder="React, Node.js, MongoDB"
                  />
                </div>

                {/* Featured and Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="mr-2"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">Featured Project</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Order Index</label>
                    <input
                        type="number"
                        name="order_index"
                        value={formData.order_index}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-primary border border-gray-600 rounded-md focus:border-accent focus:outline-none"
                        min="0"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 bg-primary border border-gray-600 rounded-md focus:border-accent focus:outline-none"
                      placeholder="Describe your project..."
                      required
                  />
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Project Thumbnail</label>
                  <ImageUpload
                      onImageSelect={handleThumbnailSelect}
                      maxFiles={1}
                      acceptedTypes="image/*"
                  />
                  {formData.thumbnail && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Current Thumbnail:</p>
                        <img
                            src={getImageUrl(formData.thumbnail)}
                            alt="Thumbnail preview"
                            className="w-32 h-20 object-cover rounded-lg"
                            onError={handleImageError}
                        />
                      </div>
                  )}
                </div>

                {/* Additional Images Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Project Images</label>
                  <ImageUpload
                      onImageSelect={handleImagesSelect}
                      maxFiles={5}
                      acceptedTypes="image/*"
                      multiple
                  />
                  {formData.images && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Current Images:</p>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                          {formData.images.split(',').filter(Boolean).map((img, index) => (
                              <div key={index} className="relative group">
                                <img
                                    src={getImageUrl(img.trim())}
                                    alt={`Project image ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => openImagePreview(formData.images, index)}
                                    onError={handleImageError}
                                />
                                {/* Preview overlay */}
                                <div
                                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                                    onClick={() => openImagePreview(formData.images, index)}
                                >
                                  <svg
                                      className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                  >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                  </svg>
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-between">
                  <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : editProject ? 'Update Project' : 'Add Project'}
                  </button>

                  {editProject && (
                      <button
                          type="button"
                          onClick={resetForm}
                          className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-md font-medium transition-colors"
                      >
                        Cancel Edit
                      </button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Projects List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Existing Projects</h2>

              {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No projects found. Add your first project above!</p>
                  </div>
              ) : (
                  <div className="grid gap-6">
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-secondary rounded-lg p-6 border border-gray-700"
                        >
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Project Thumbnail */}
                            <div className="flex-shrink-0">
                              <img
                                  src={getImageUrl(project.thumbnail)}
                                  alt={project.title}
                                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                                  onError={handleImageError}
                              />
                            </div>

                            {/* Project Details */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold">{project.title}</h3>
                                <div className="flex gap-2">
                                  {project.featured === 1 && (
                                      <span className="px-2 py-1 bg-accent text-white text-xs rounded-full">
                                Featured
                              </span>
                                  )}
                                  <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full">
                              Order: {project.order_index}
                            </span>
                                </div>
                              </div>

                              <p className="text-gray-300 mb-3 line-clamp-3">{project.description}</p>

                              {/* Tags */}
                              {project.tags && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {project.tags.split(',').map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-primary text-accent text-xs rounded-full"
                                        >
                                {tag.trim()}
                              </span>
                                    ))}
                                  </div>
                              )}

                              {/* Links */}
                              <div className="flex gap-4 mb-3">
                                {project.url && (
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:text-accent/80 text-sm"
                                    >
                                      🔗 Live Demo
                                    </a>
                                )}
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:text-accent/80 text-sm"
                                    >
                                      📂 GitHub
                                    </a>
                                )}
                              </div>

                              {/* Additional Images */}
                              {project.images && (
                                  <div className="mb-3">
                                    <p className="text-sm text-gray-400 mb-2">Additional Images:</p>
                                    <div className="flex gap-2 overflow-x-auto">
                                      {project.images.split(',').filter(Boolean).map((img, index) => (
                                          <img
                                              key={index}
                                              src={getImageUrl(img.trim())}
                                              alt={`${project.title} image ${index + 1}`}
                                              className="w-20 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                                              onClick={() => openImagePreview(project.images, index)}
                                              onError={handleImageError}
                                          />
                                      ))}
                                    </div>
                                  </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md text-sm transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Preview Modal */}
        <AnimatePresence>
          {showImagePreview && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
                  onClick={closeImagePreview}
              >
                <div className="relative max-w-4xl max-h-full p-4">
                  <img
                      src={previewImages[currentImageIndex]}
                      alt={`Preview ${currentImageIndex + 1}`}
                      className="max-w-full max-h-full object-contain"
                      onClick={(e) => e.stopPropagation()}
                  />

                  {/* Navigation Buttons */}
                  {previewImages.length > 1 && (
                      <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                  )}

                  {/* Close Button */}
                  <button
                      onClick={closeImagePreview}
                      className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Image Counter */}
                  {previewImages.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {previewImages.length}
                      </div>
                  )}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default ProjectManager;