// src/pages/admin/ProjectManager.jsx - Complete Implementation
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllProjects, createProject, updateProject, deleteProject } from '../../services/api';
import ImageUpload from '../../components/common/ImageUpload';
import { motion } from 'framer-motion';

const ProjectManager = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [editProject, setEditProject] = useState(null);
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getAllProjects();
      setProjects(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again.');
      setIsLoading(false);
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

  const handleThumbnailSelect = async (file) => {
    if (file) {
      setSelectedThumbnail(file);
      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        thumbnail: previewUrl
      });
    } else {
      setSelectedThumbnail(null);
      setFormData({
        ...formData,
        thumbnail: ''
      });
    }
  };

  const handleImagesSelect = async (files) => {
    if (files && files.length > 0) {
      setSelectedImages(files);
      // Create preview URLs
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setFormData({
        ...formData,
        images: previewUrls.join(',')
      });
    } else {
      setSelectedImages([]);
      setFormData({
        ...formData,
        images: ''
      });
    }
  };

  const uploadFile = async (file, type = 'image') => {
    const formData = new FormData();
    formData.append(type, file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
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
      let finalFormData = { ...formData };

      // Upload thumbnail if selected
      if (selectedThumbnail) {
        try {
          const thumbnailPath = await uploadFile(selectedThumbnail, 'thumbnail');
          finalFormData.thumbnail = thumbnailPath;
        } catch (error) {
          setError('Failed to upload thumbnail. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      // Upload additional images if selected
      if (selectedImages.length > 0) {
        try {
          const imagePaths = [];
          for (let file of selectedImages) {
            const imagePath = await uploadFile(file, 'image');
            imagePaths.push(imagePath);
          }
          finalFormData.images = imagePaths.join(',');
        } catch (error) {
          setError('Failed to upload images. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      if (editProject) {
        await updateProject(editProject.id, finalFormData);
        showSuccessMessage('Project updated successfully!');
      } else {
        await createProject(finalFormData);
        showSuccessMessage('New project added successfully!');
      }

      await fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project. Please try again.');
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
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      thumbnail: project.thumbnail || '',
      images: project.images || '',
      tags: project.tags || '',
      url: project.url || '',
      github_url: project.github_url || '',
      featured: project.featured === 1,
      order_index: project.order_index
    });

    // Clear selected files when editing (use existing URLs)
    setSelectedThumbnail(null);
    setSelectedImages([]);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setIsLoading(true);
      try {
        await deleteProject(id);
        showSuccessMessage('Project deleted successfully!');
        await fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Failed to delete project. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
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
            <h1 className="text-4xl font-bold text-white mb-4">Project Manager</h1>
            <p className="text-gray-400">Manage your portfolio projects with images and files</p>
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

          {/* Project Form */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {editProject ? 'Edit Project' : 'Add New Project'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="Project name"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                    Technologies (comma separated)
                  </label>
                  <input
                      id="tags"
                      name="tags"
                      type="text"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="React, Node.js, MongoDB"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="Describe your project..."
                />
              </div>

              {/* Thumbnail Upload */}
              <div>
                <ImageUpload
                    label="Project Thumbnail"
                    onImageSelect={handleThumbnailSelect}
                    currentImage={formData.thumbnail}
                    acceptMultiple={false}
                    className="mb-4"
                />
                {!selectedThumbnail && formData.thumbnail && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-400 mb-2">Current thumbnail:</p>
                      <img
                          src={formData.thumbnail}
                          alt="Current thumbnail"
                          className="max-w-32 max-h-32 rounded-md object-cover"
                      />
                    </div>
                )}
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
                {!selectedImages.length && formData.images && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-400 mb-2">Current images:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.images.split(',').filter(Boolean).map((img, index) => (
                            <img
                                key={index}
                                src={img.trim()}
                                alt={`Project image ${index + 1}`}
                                className="w-20 h-20 rounded-md object-cover"
                            />
                        ))}
                      </div>
                    </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                    Live URL
                  </label>
                  <input
                      id="url"
                      name="url"
                      type="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label htmlFor="github_url" className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                      id="github_url"
                      name="github_url"
                      type="url"
                      value={formData.github_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="order_index" className="block text-sm font-medium text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                      id="order_index"
                      name="order_index"
                      type="number"
                      min="0"
                      value={formData.order_index}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>

                <div className="flex items-center">
                  <label htmlFor="featured" className="flex items-center space-x-3 cursor-pointer">
                    <input
                        id="featured"
                        name="featured"
                        type="checkbox"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-accent bg-secondary border-gray-600 rounded focus:ring-accent focus:ring-2"
                    />
                    <span className="text-gray-300 font-medium">Featured Project</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-accent text-primary rounded-md hover:bg-accent/80 transition-colors disabled:opacity-50 font-medium"
                >
                  {isLoading ? 'Saving...' : (editProject ? 'Update Project' : 'Add Project')}
                </button>

                {editProject && (
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

          {/* Projects List */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Existing Projects</h2>

            {isLoading && projects.length === 0 ? (
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
                                  src={project.thumbnail}
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

                          <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                            {project.description}
                          </p>

                          {project.tags && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {project.tags.split(',').slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs bg-secondary text-gray-300 rounded"
                                    >
                            {tag.trim()}
                          </span>
                                ))}
                                {project.tags.split(',').length > 3 && (
                                    <span className="px-2 py-1 text-xs bg-secondary text-gray-400 rounded">
                            +{project.tags.split(',').length - 3}
                          </span>
                                )}
                              </div>
                          )}

                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              {project.url && (
                                  <a
                                      href={project.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-accent hover:text-accent/80 text-sm"
                                  >
                                    Live Demo
                                  </a>
                              )}
                              {project.github_url && (
                                  <a
                                      href={project.github_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-accent hover:text-accent/80 text-sm"
                                  >
                                    GitHub
                                  </a>
                              )}
                            </div>

                            <div className="flex space-x-2">
                              <button
                                  onClick={() => handleEdit(project)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                  onClick={() => handleDelete(project.id, project.title)}
                                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
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
          </motion.div>
        </motion.div>
      </div>
  );
};

export default ProjectManager;