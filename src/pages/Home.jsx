// src/pages/Home.jsx - Updated with data fetching for Skills and Projects
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Projects from '../components/home/Projects';
import Skills from '../components/home/Skills';
import CVDownload from '../components/cv/CVDownload';
import Contact from '../components/home/Contact';
import { getContentBySection, getAllProjects, getAllSkills } from '../services/api'; // Import getAllProjects and getAllSkills

const Home = () => {
    const [content, setContent] = useState({
        hero: [],
        about: []
    });
    const [projects, setProjects] = useState([]); // State for projects
    const [skills, setSkills] = useState([]); // State for skills
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [heroData, aboutData, projectsData, skillsData] = await Promise.all([
                    getContentBySection('hero'),
                    getContentBySection('about'),
                    getAllProjects(), // Fetch projects
                    getAllSkills() // Fetch skills
                ]);

                setContent({
                    hero: heroData,
                    about: aboutData
                });
                setProjects(projectsData); // Set projects state
                setSkills(skillsData); // Set skills state

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

    // Filter for featured projects to pass to the Projects component
    const featuredProjects = projects.filter(p => p.featured === 1);

    return (
        <div className="min-h-screen bg-primary">
            {/* Hero Section */}
            <Hero content={content.hero} />

            {/* About Section */}
            <About content={content.about} />

            {/* Skills Section */}
            <Skills skills={skills} /> {/* Pass skills data as props */}

            {/* Projects Section */}
            <Projects projects={featuredProjects} /> {/* Pass featured projects data as props */}

            {/* CV Download Section */}
            <CVDownload />

            {/* Contact Section */}
            <Contact />
        </div>
    );
};

export default Home;