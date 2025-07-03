// src/pages/ProjectDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '../components/three/Background';
import { getProjectById } from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageHelper';// Import dari helper

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleImageClick = (imgUrl) => setSelectedImage(imgUrl);
  const handleCloseModal = () => setSelectedImage(null);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-glow h-24 w-24 rounded-full bg-accent mb-4 mx-auto"></div>
            <p className="text-xl">Loading project details...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="pt-24 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl text-red-500 mb-4">Error</h2>
            <p className="mb-6">{error}</p>
            <Link
                to="/projects"
                className="px-6 py-3 border border-accent text-accent rounded-full hover:bg-accent hover:text-primary transition-colors inline-block"
            >
              Back to Projects
            </Link>
          </div>
        </div>
    );
  }

  if (!project) {
    return (
        <div className="pt-24 pb-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl mb-4">Project Not Found</h2>
            <p className="mb-6">Sorry, the project you're looking for doesn't exist or has been removed.</p>
            <Link
                to="/projects"
                className="px-6 py-3 border border-accent text-accent rounded-full hover:bg-accent hover:text-primary transition-colors inline-block"
            >
              Back to Projects
            </Link>
          </div>
        </div>
    );
  }

  const fullThumbnailUrl = getImageUrl(project.thumbnail);
  const fullImageUrls = project.images ? project.images.split(',').map(img => getImageUrl(img.trim())) : [];

  return (
      <>
        <Background />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <Link
                to="/projects"
                className="inline-flex items-center text-accent mb-8 hover:underline"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Projects
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
              <div className="bg-primary bg-opacity-70 p-8 rounded-xl backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/3">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags?.split(',').map((tag, i) => (
                          <span
                              key={i}
                              className="bg-secondary text-xs px-2 py-1 rounded-full"
                          >
                        {tag.trim()}
                      </span>
                      ))}
                    </div>

                    <div className="prose prose-invert max-w-none mb-8">
                      <p className="text-gray-300">{project.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {project.url && (
                          <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-accent text-primary rounded-full hover:bg-opacity-90 inline-flex items-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visit Live Site
                          </a>
                      )}

                      {project.github_url && (
                          <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 border border-accent text-accent rounded-full hover:bg-accent hover:text-primary transition-colors inline-flex items-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                            View Code
                          </a>
                      )}
                    </div>
                  </div>

                  <div className="md:w-1/3">
                    <div className="sticky top-24">
                      <img
                          src={fullThumbnailUrl}
                          alt={project.title}
                          className="w-full h-auto rounded-lg shadow-lg mb-6 cursor-pointer hover:opacity-80 transition"
                          onClick={() => handleImageClick(fullThumbnailUrl)}
                          onError={handleImageError}
                      />

                      {fullImageUrls.map((imgUrl, index) => (
                          <img
                              key={index}
                              src={imgUrl}
                              alt={`${project.title} - Gambar ${index + 1}`}
                              className="w-full h-auto rounded-lg shadow-lg mb-6 cursor-pointer hover:opacity-80 transition"
                              onClick={() => handleImageClick(imgUrl)}
                              onError={handleImageError}
                          />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modal Image Popup */}
        <AnimatePresence>
          {selectedImage && (
              <motion.div
                  className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleCloseModal}
              >
                <motion.div
                    className="relative"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                >
                  <button
                      onClick={handleCloseModal}
                      className="absolute top-2 right-2 bg-white text-black rounded-full p-2 shadow-lg hover:bg-gray-300 z-50"
                  >
                    ✕
                  </button>
                  <img
                      src={selectedImage}
                      alt="Tampilan diperbesar"
                      className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                  />
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </>
  );
};

export default ProjectDetail;