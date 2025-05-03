// src/pages/About.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getContentBySection, getAllSkills } from '../services/api';
import AboutSection from '../components/home/About';
import Skills from '../components/home/Skills';
import Background from '../components/three/Background';

const About = () => {
  const [aboutContent, setAboutContent] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutData, skillsData] = await Promise.all([
          getContentBySection('about'),
          getAllSkills()
        ]);
        
        setAboutContent(aboutData);
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching about page data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-glow h-24 w-24 rounded-full bg-accent mb-4 mx-auto"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Background />
      <div className="pt-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient">Me</span>
            </h1>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Get to know more about my background, skills, and what drives me to create exceptional digital experiences.
            </p>
          </motion.div>
        </div>
        
        <AboutSection content={aboutContent} />
        
        <div className="py-12 bg-secondary bg-opacity-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">
                My <span className="text-gradient">Journey</span>
              </h2>
              <div className="space-y-8">
                <div className="relative pl-8 border-l-2 border-accent">
                  <span className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-accent"></span>
                  <div className="mb-2">
                    <span className="text-accent font-bold">Mar 2025 – Present</span>
                    <h3 className="text-xl font-bold">Freelance Web Developer</h3>
                    <p className="text-gray-400">Apcoms Solutions</p>
                  </div>
                  <p className="text-gray-300">
                    Developing modern and responsive websites as a freelance developer. Focused on delivering efficient, high-quality frontend solutions for various clients.
                  </p>
                </div>

                <div className="relative pl-8">
                  <span className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-accent"></span>
                  <div className="mb-2">
                    <span className="text-accent font-bold">2022 – Present</span>
                    <h3 className="text-xl font-bold">Computer Science Student</h3>
                    <p className="text-gray-400">Universitas Pasundan</p>
                  </div>
                  <p className="text-gray-300">
                    Studying Informatics Engineering with a strong emphasis on web development, software design, and user interface technologies.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <Skills skills={skills} />
      </div>
    </>
  );
};

export default About;
