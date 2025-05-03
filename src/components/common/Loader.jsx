// src/components/common/Loader.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };
  
  const container = fullScreen ? 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50' : 'flex flex-col items-center justify-center';
  
  return (
    <div className={container}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${sizes[size]} rounded-full bg-accent mb-4 animate-glow`}
      />
      {text && <p className="text-lg text-white">{text}</p>}
    </div>
  );
};

export default Loader;