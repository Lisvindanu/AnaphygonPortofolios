// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Background from '../components/three/Background';
import Button from '../components/common/Button';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Skills from '../components/home/Skills';
import Projects from '../components/home/Projects';
import Contact from '../components/home/Contact';
import { getAllContent, getAllProjects, getAllSkills } from '../services/api';

const Home = () => {
  const [content, setContent] = useState({});
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentData, projectsData, skillsData] = await Promise.all([
          getAllContent(),
          getAllProjects(),
          getAllSkills()
        ]);
        
        setContent(contentData);
        setProjects(projectsData);
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching data:', error);
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
      <div className="pt-20">
        <Hero content={content.hero || []} />
        <About content={content.about || []} />
        <Skills skills={skills} />
        <Projects projects={projects.slice(0, 4)} />
        <Contact content={content.contact || []} />
      </div>
    </>
  );
};

export default Home;