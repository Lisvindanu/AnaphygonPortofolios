import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

const Hero = ({ content = [] }) => {
  const heroContent = content[0] || {
    title: 'I am a Creative Developer',
    subtitle: 'Designing digital experiences for the future',
    content: 'Focused on creating immersive and innovative digital experiences through code and design.'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-4">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-accent text-lg font-mono uppercase tracking-wider mb-4"
          >
            Welcome to my portfolio
          </motion.h2>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-gradient">{heroContent.title}</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-6"
          >
            {heroContent.subtitle}
          </motion.p>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            {heroContent.content}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/projects">
              <Button variant="gradient" size="lg">
                View My Work
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Me
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center">
              {/* <p className="text-sm text-gray-400 mb-2">Scroll Down</p>
              <div className="w-0.5 h-12 bg-accent animate-pulse"></div> */}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;