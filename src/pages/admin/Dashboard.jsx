import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getAllProjects, getAllContent, getAllSkills } from '../../services/api';
import { getAllCVs } from '../../services/cvApi';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    content: 0,
    skills: 0,
    cvs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, content, skills, cvs] = await Promise.all([
          getAllProjects(),
          getAllContent(),
          getAllSkills(),
          getAllCVs().catch(() => []) // Fallback if CV API not available
        ]);

        setStats({
          projects: projects.length,
          content: content.length,
          skills: skills.length,
          cvs: cvs.filter(cv => cv.is_active).length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const adminSections = [
    {
      title: 'Content Management',
      description: 'Edit website content, including hero section, about page, and more.',
      link: '/admin/content',
      icon: '📝'
    },
    {
      title: 'Project Management',
      description: 'Add, edit, or remove projects from your portfolio.',
      link: '/admin/projects',
      icon: '🏗️'
    },
    {
      title: 'Skills Management',
      description: 'Update your skills and proficiency levels.',
      link: '/admin/skills',
      icon: '🔧'
    },
    {
      title: 'CV Management',
      description: 'Upload, manage, and track CV downloads.',
      link: '/admin/cv',
      icon: '📄'
    }
  ];

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: '🚀' },
    { label: 'Content Sections', value: stats.content, icon: '📝' },
    { label: 'Skills', value: stats.skills, icon: '⚡' },
    { label: 'Active CVs', value: stats.cvs, icon: '📄' }
  ];

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-glow h-16 w-16 rounded-full bg-accent mb-4 mx-auto"></div>
            <p className="text-xl">Loading dashboard...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser.username}!</h1>
          <p className="text-gray-400">Manage your portfolio content and settings from this dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, index) => (
              <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect p-6 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="text-4xl mr-4">{stat.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Admin Sections</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminSections.map((section, index) => (
              <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-effect rounded-lg overflow-hidden"
              >
                <Link to={section.link} className="block p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{section.icon}</div>
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                  </div>
                  <p className="text-gray-400">{section.description}</p>
                </Link>
              </motion.div>
          ))}
        </div>

        <div className="mt-12 p-6 glass-effect rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
                to="/admin/projects"
                className="px-4 py-2 bg-accent text-primary rounded-md hover:bg-opacity-80 transition"
            >
              Manage Projects
            </Link>
            <Link
                to="/admin/cv"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Upload CV
            </Link>
            <Link
                to="/"
                className="px-4 py-2 border border-accent text-accent rounded-md hover:bg-accent hover:text-primary transition"
                target="_blank"
            >
              View Website
            </Link>
          </div>
        </div>
      </motion.div>
  );
};

export default Dashboard;