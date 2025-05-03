import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../common/Card';

const Projects = ({ projects = [] }) => {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-accent text-lg font-mono uppercase tracking-wider mb-4">My Work</h2>
          <h1 className="text-4xl font-bold mb-6">
            <span className="text-gradient">Featured Projects</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            A selection of my recent projects showcasing my skills and expertise in web development, design, and interactive experiences.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-primary group">
                <div className="relative overflow-hidden">
                  <img
                    src={project.thumbnail || 'https://via.placeholder.com/600x400'}
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
                  
                  <p className="text-gray-400 mb-4 line-clamp-2">
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
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link 
            to="/projects" 
            className="px-6 py-3 border border-accent text-accent rounded-full hover:bg-accent hover:text-primary transition-colors inline-block"
          >
            View All Projects
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;