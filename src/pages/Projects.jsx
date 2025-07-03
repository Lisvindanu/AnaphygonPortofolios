// src/pages/Projects.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllProjects } from '../services/api';
import Card from '../components/common/Card';
import Background from '../components/three/Background';
import { Link } from 'react-router-dom';

// Definisikan base URL untuk API dan aset
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function untuk menentukan URL gambar yang benar
const getImageUrl = (path) => {
  if (!path) {
    return 'https://via.placeholder.com/600x400';
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_URL}${path}`;
};


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Extract unique categories from projects
  const getCategories = (projects) => {
    const tagsSet = new Set();

    projects.forEach(project => {
      if (project.tags) {
        project.tags.split(',').forEach(tag => {
          tagsSet.add(tag.trim());
        });
      }
    });

    return ['all', ...Array.from(tagsSet)];
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilterChange = (category) => {
    setActiveFilter(category);

    if (category === 'all') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project =>
          project.tags && project.tags.toLowerCase().includes(category.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-glow h-24 w-24 rounded-full bg-accent mb-4 mx-auto"></div>
            <p className="text-xl">Loading projects...</p>
          </div>
        </div>
    );
  }

  const categories = getCategories(projects);

  return (
      <>
        <Background />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                My <span className="text-gradient">Projects</span>
              </h1>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Explore my portfolio of work showcasing innovative design, interactive experiences, and creative solutions.
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category, index) => (
                  <motion.button
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`px-4 py-2 rounded-full transition-colors ${
                          activeFilter === category
                              ? 'bg-accent text-primary'
                              : 'bg-secondary text-white hover:bg-gray-700'
                      }`}
                      onClick={() => handleFilterChange(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.button>
              ))}
            </div>

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                  <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card className="h-full bg-primary overflow-hidden group">
                      <div className="relative overflow-hidden">
                        <img
                            src={getImageUrl(project.thumbnail)}
                            alt={project.title}
                            className="w-full h-56 object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        />

                        {project.featured && (
                            <div className="absolute top-4 right-4 bg-accent text-primary text-xs font-bold px-2 py-1 rounded-full">
                              Featured
                            </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>

                        <p className="text-gray-400 mb-4">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags?.split(',').map((tag, i) => (
                              <span
                                  key={i}
                                  className="bg-secondary text-xs px-2 py-1 rounded-full"
                              >
                          {tag.trim()}
                        </span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <Link
                              to={`/projects/${project.id}`}
                              className="text-accent flex items-center group-hover:underline"
                          >
                            View Details
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>


                          <div className="flex space-x-2">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-accent"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                  </svg>
                                </a>
                            )}

                            {project.url && (
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-accent"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
              ))}
            </motion.div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold mb-4">No projects found</h3>
                  <p className="text-gray-400">
                    No projects matching the selected filter. Try another category.
                  </p>
                </div>
            )}
          </div>
        </div>
      </>
  );
};

export default Projects;
