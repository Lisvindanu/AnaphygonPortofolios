
// src/components/common/Card.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  glassEffect = false,
  borderEffect = false,
  onClick
}) => {
  const baseClasses = 'rounded-lg overflow-hidden';
  
  const glassClasses = glassEffect ? 'bg-opacity-10 backdrop-filter backdrop-blur-md border border-white border-opacity-10' : '';
  
  const borderClasses = borderEffect ? 'relative before:absolute before:inset-0 before:p-[2px] before:rounded-lg before:bg-gradient-to-r before:from-accent before:to-highlight before:-z-10' : '';
  
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`${baseClasses} ${glassClasses} ${borderClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;
