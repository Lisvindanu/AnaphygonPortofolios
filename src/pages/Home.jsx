// src/pages/Home.jsx - Updated with CV Download Section
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Projects from '../components/home/Projects';
import Skills from '../components/home/Skills';
import Contact from '../components/home/Contact';
import CVDownload from '../components/cv/CVDownload';
import { getContentBySection } from '../services/api';

const Home = () => {
  const [content, setContent] = useState({
    hero: [],
    about: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [heroData, aboutData] = await Promise.all([
          getContentBySection('hero'),
          getContentBySection('about')
        ]);

        setContent({
          hero: heroData,
          about: aboutData
        });
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) {
    return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </motion.div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-primary">
        {/* Hero Section */}
        <Hero content={content.hero} />

        {/* About Section */}
        <About content={content.about} />

        {/* Skills Section */}
        <Skills />

        {/* Projects Section */}
        <Projects />

        {/* CV Download Section */}
        <CVDownload />

        {/* Contact Section */}
        <Contact />
      </div>
  );
};

export default Home;