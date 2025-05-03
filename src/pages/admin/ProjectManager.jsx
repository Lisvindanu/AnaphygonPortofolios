// src/pages/admin/ProjectManager.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllProjects, createProject, updateProject, deleteProject } from '../../services/api';
import Button from '../../components/common/Button';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
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
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedProject(null);
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      images: '',
      tags: '',
      url: '',
      github_url: '',
      featured: false,
      order_index: projects.length
    });
  };

  const handleEdit = (project) => {
    setIsEditing(true);
    setIsCreating(false);
    setSelectedProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      thumbnail: project.thumbnail || '',
      images: project.images || '',
      tags: project.tags || '',
      url: project.url || '',
      github_url: project.github_url || '',
      featured: project.featured || false,
      order_index: project.order_index || 0
    });
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        
        // Update local state
        setProjects(projects.filter(project => project.id !== projectId));
        
        // Show success notification
        showNotification('Project deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting project:', error);
        showNotification('Error deleting project. Please try again.', 'error');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isCreating) {
        // Create new project
        const result = await createProject(formData);
        
        // Update local state
        setProjects([...projects, { id: result.id, ...formData }]);
        showNotification('Project created successfully!', 'success');
      } else if (isEditing) {
        // Update existing project
        await updateProject(selectedProject.id, formData);
        
        // Update local state
        setProjects(projects.map(project => 
          project.id === selectedProject.id ? { ...project, ...formData } : project
        ));
        showNotification('Project updated successfully!', 'success');
      }
      
      // Reset form
      setIsCreating(false);
      setIsEditing(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
      showNotification('Error saving project. Please try again.', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-glow h-16 w-16 rounded-full bg-accent mb-4 mx-auto"></div>
          <p className="text-xl">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 pb-12"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Project Manager</h1>
          <p className="text-gray-400">Manage your portfolio projects.</p>
        </div>
        <Button onClick={handleCreateNew} variant="accent">
          Add New Project
        </Button>
      </div>
      
      {notification.show && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-md ${notification.type === 'success' ? 'bg-green-500 bg-opacity-10 text-green-500' : 'bg-red-500 bg-opacity-10 text-red-500'}`}
        >
          {notification.message}
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="glass-effect p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Projects List</h3>
            
            {projects.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    className={`w-full text-left p-3 rounded-md transition-colors ${selectedProject?.id === project.id ? 'bg-accent text-primary' : 'hover:bg-secondary'}`}
                    onClick={() => handleEdit(project)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium truncate">{project.title}</h4>
                        {project.featured && (
                          <span className="text-xs bg-highlight bg-opacity-20 text-highlight px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No projects found. Create one!</p>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="glass-effect p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              {isCreating ? 'Create New Project' : isEditing ? 'Edit Project' : 'Select a project or create a new one'}
            </h3>
            
            {(isCreating || isEditing) && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                      Title *
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300 mb-1">
                      Thumbnail URL
                    </label>
                    <input
                      id="thumbnail"
                      name="thumbnail"
                      type="text"
                      value={formData.thumbnail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      id="tags"
                      name="tags"
                      type="text"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                      placeholder="e.g. React, Tailwind, API"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-300 mb-1">
                      Additional Images URLs (comma separated)
                    </label>
                    <input
                      id="images"
                      name="images"
                      type="text"
                      value={formData.images}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
                      Live URL
                    </label>
                    <input
                      id="url"
                      name="url"
                      type="text"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="github_url" className="block text-sm font-medium text-gray-300 mb-1">
                      GitHub URL
                    </label>
                    <input
                      id="github_url"
                      name="github_url"
                      type="text"
                      value={formData.github_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="order_index" className="block text-sm font-medium text-gray-300 mb-1">
                      Display Order
                    </label>
                    <input
                      id="order_index"
                      name="order_index"
                      type="number"
                      min="0"
                      value={formData.order_index}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                    />
                  </div>
                  
                  <div className="flex items-center h-full pt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-accent bg-secondary border-gray-700 rounded focus:ring-accent"
                      />
                      <span className="ml-2 text-sm text-gray-300">Featured Project</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                      setSelectedProject(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient">
                    {isCreating ? 'Create Project' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectManager;