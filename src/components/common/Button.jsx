// src/components/common/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent';
  
  const variantClasses = {
    primary: 'bg-accent text-primary hover:bg-opacity-80',
    secondary: 'bg-secondary text-white hover:bg-opacity-80',
    outline: 'border border-accent text-accent hover:bg-accent hover:text-primary',
    ghost: 'bg-transparent text-white hover:bg-white hover:bg-opacity-10',
    gradient: 'bg-gradient-to-r from-accent to-highlight text-primary hover:opacity-90'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    xl: 'text-lg px-8 py-4'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;