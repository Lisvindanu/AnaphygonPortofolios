import React from 'react';
import { motion } from 'framer-motion';

const About = ({ content = [], profileImage }) => {
  const aboutContent = content[0] || {
    title: 'About Me',
    subtitle: 'Who I am and what I do',
    content: 'I am a passionate developer with a keen eye for design and a love for creating futuristic digital experiences. With expertise in front-end development, 3D animations, and interactive designs, I bring concepts to life through code.'
  };

  // Using the provided image instead of the placeholder
  const defaultProfileImage = "https://i.imgur.com/pCDLtbM.png";

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="bg-secondary w-full aspect-square rounded-2xl overflow-hidden">
                <img 
                  src={profileImage || defaultProfileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-accent"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-highlight"></div>
              
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute -bottom-10 left-10 bg-primary p-4 rounded-lg shadow-lg border border-gray-800"
              >
                <div className="flex space-x-6">
                  <div className="text-center">
                    <p className="text-accent text-2xl font-bold">1+</p>
                    <p className="text-sm text-gray-400">Years Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="text-accent text-2xl font-bold">5+</p>
                    <p className="text-sm text-gray-400">Projects</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-accent text-lg font-mono uppercase tracking-wider mb-4">
              {aboutContent.subtitle}
            </h2>
            
            <h1 className="text-4xl font-bold mb-6">
              <span className="text-gradient">{aboutContent.title}</span>
            </h1>
            
            <div className="text-gray-300 space-y-4">
              <p>{aboutContent.content}</p>
          
              <p>When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sketching UI concepts for future projects.</p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-secondary rounded-lg">
                <span className="text-accent">React</span>
              </div>
              <div className="px-4 py-2 bg-secondary rounded-lg">
                <span className="text-accent">Three.js</span>
              </div>
              <div className="px-4 py-2 bg-secondary rounded-lg">
                <span className="text-accent">Tailwind CSS</span>
              </div>
              <div className="px-4 py-2 bg-secondary rounded-lg">
                <span className="text-accent">Node.js</span>
              </div>
            </div>
            
            <div className="mt-8">
              <a href="#contact" className="px-6 py-3 bg-accent text-primary rounded-full hover:bg-opacity-80 transition-all inline-flex items-center">
                Contact Me
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;