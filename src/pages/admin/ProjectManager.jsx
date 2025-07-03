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
      const response = await getAllProjects();
      setProjects(response);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove the old getImageUrl function since we're importing it

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
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      thumbnail: project.thumbnail,
      images: project.images,
      tags: project.tags,
      url: project.url,
      github_url: project.github_url,
      featured: project.featured === 1,
      order_index: project.order_index
    });
    setSelectedThumbnail(null);
    setSelectedImages([]);
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
    const value = e.target.type === 'checkbox' ? e.target.checked
        : e.target.type === 'number' ? parseInt(e.target.value, 10) || 0
            : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleThumbnailSelect = (file) => {
    if (file) {
      setSelectedThumbnail(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, thumbnail: previewUrl });
    } else {
      setSelectedThumbnail(null);
      setFormData({ ...formData, thumbnail: '' });
    }
  };

  const handleImagesSelect = (files) => {
    if (files && files.length > 0) {
      setSelectedImages(files);
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setFormData({ ...formData, images: previewUrls.join(',') });
    } else {
      setSelectedImages([]);
      setFormData({ ...formData, images: '' });
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

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'thumbnail' && key !== 'images') {
        submissionData.append(key, formData[key]);
      }
    });

    if (selectedThumbnail) {
      submissionData.append('thumbnail', selectedThumbnail);
    }

    if (selectedImages.length > 0) {
      selectedImages.forEach(file => {
        submissionData.append('images', file);
      });
    }

    try {
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

  return (
      <div className="min-h-screen bg-primary text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Project Manager</h1>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200">
                  {successMessage}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                  {error}
                </div>
            )}

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                      Project Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-primary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        placeholder="Enter project title"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-primary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        placeholder="React, Node.js, MongoDB"
                    />
                  </div>

                  {/* Project URL */}
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                      Project URL
                    </label>
                    <input
                        type="url"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-primary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        placeholder="https://your-project.com"
                    />
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label htmlFor="github_url" className="block text-sm font-medium text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                        type="url"
                        id="github_url"
                        name="github_url"
                        value={formData.github_url}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-primary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        placeholder="https://github.com/username/repo"
                    />
                  </div>

                  {/* Featured */}
                  <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                      Featured Project
                    </label>
                  </div>

                  {/* Order Index */}
                  <div>
                    <label htmlFor="order_index" className="block text-sm font-medium text-gray-300 mb-2">
                      Order Index
                    </label>
                    <input
                        type="number"
                        id="order_index"
                        name="order_index"
                        value={formData.order_index}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-primary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        placeholder="0"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                      id="description"
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-primary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="Describe your project..."
                  />
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <ImageUpload
                      label="Project Thumbnail"
                      onImageSelect={handleThumbnailSelect}
                      currentImage={getImageUrl(formData.thumbnail)}
                      acceptMultiple={false}
                      className="mb-4"
                  />
                </div>

                {/* Additional Images Upload */}
                <div>
                  <ImageUpload
                      label="Additional Project Images"
                      onImageSelect={handleImagesSelect}
                      acceptMultiple={true}
                      maxFiles={5}
                      className="mb-4"
                  />

                  {/* Existing Images Preview */}
                  {formData.images && !selectedImages.length && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-3">Current images:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                      className="px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-md font-medium transition-colors disabled:opacity-50"
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

              {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading projects...</p>
                  </div>
              ) : projects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No projects found. Add your first project above!</p>
                  </div>
              ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary/30 rounded-lg border border-gray-700 overflow-hidden hover:border-accent/50 transition-colors"
                        >
                          {/* Project Thumbnail */}
                          {project.thumbnail && (
                              <div className="aspect-video overflow-hidden">
                                <img
                                    src={getImageUrl(project.thumbnail)}
                                    alt={project.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                          )}

                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-white truncate">{project.title}</h3>
                              {project.featured === 1 && (
                                  <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-full border border-accent/30">
                            Featured
                          </span>
                              )}
                            </div>

                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                              {project.description}
                            </p>

                            {/* Tags */}
                            {project.tags && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {project.tags.split(',').map((tag, index) => (
                                      <span
                                          key={index}
                                          className="px-2 py-1 text-xs bg-secondary text-gray-300 rounded-full"
                                      >
                              {tag.trim()}
                            </span>
                                  ))}
                                </div>
                            )}

                            {/* Additional Images Preview */}
                            {project.images && (
                                <div className="mb-3">
                                  <p className="text-xs text-gray-400 mb-2">Additional Images:</p>
                                  <div className="flex gap-2 overflow-x-auto">
                                    {project.images.split(',').filter(Boolean).slice(0, 4).map((img, index) => (
                                        <div key={index} className="relative flex-shrink-0">
                                          <img
                                              src={getImageUrl(img.trim())}
                                              alt={`${project.title} image ${index + 1}`}
                                              className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                              onClick={() => openImagePreview(project.images, index)}
                                          />
                                          {/* Preview icon */}
                                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 rounded flex items-center justify-center transition-all cursor-pointer">
                                            <svg
                                                className="w-4 h-4 text-white opacity-0 hover:opacity-100 transition-opacity"
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
                                    {project.images.split(',').filter(Boolean).length > 4 && (
                                        <div
                                            className="w-12 h-12 bg-secondary/50 rounded flex items-center justify-center cursor-pointer hover:bg-secondary/70 transition-colors"
                                            onClick={() => openImagePreview(project.images, 4)}
                                        >
                                <span className="text-xs text-gray-300">
                                  +{project.images.split(',').filter(Boolean).length - 4}
                                </span>
                                        </div>
                                    )}
                                  </div>
                                </div>
                            )}

                            {/* Links */}
                            <div className="flex gap-2 mb-4">
                              {project.url && (
                                  <a
                                      href={project.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1 text-xs bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                                  >
                                    Live Demo
                                  </a>
                              )}
                              {project.github_url && (
                                  <a
                                      href={project.github_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                                  >
                                    GitHub
                                  </a>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <button
                                  onClick={() => handleEdit(project)}
                                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                  onClick={() => handleDelete(project.id)}
                                  className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                              >
                                Delete
                              </button>
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
          {showImagePreview && previewImages.length > 0 && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
                  onClick={closeImagePreview}
              >
                <div
                    className="relative max-w-5xl max-h-[90vh] bg-secondary rounded-lg overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                      onClick={closeImagePreview}
                      className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors text-xl"
                  >
                    ×
                  </button>

                  {/* Navigation buttons */}
                  {previewImages.length > 1 && (
                      <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors text-xl"
                        >
                          ←
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors text-xl"
                        >
                          →
                        </button>
                      </>
                  )}

                  {/* Image */}
                  <img
                      src={previewImages[currentImageIndex]}
                      alt={`Preview ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain max-h-[80vh]"
                  />

                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">
                        Image {currentImageIndex + 1} of {previewImages.length}
                      </p>
                      {previewImages.length > 1 && (
                          <div className="flex gap-2">
                            {previewImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        index === currentImageIndex ? 'bg-accent' : 'bg-gray-500'
                                    }`}
                                />
                            ))}
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default ProjectManager;