// src/components/common/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black bg-opacity-80 backdrop-blur-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-gradient"
          >
            Anaphygon<span className="text-accent"> Website's</span>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`relative font-medium text-sm tracking-wider uppercase transition-colors hover:text-accent ${location.pathname === item.path ? 'text-accent' : 'text-white'}`}
            >
              {item.name}
              {location.pathname === item.path && (
                <motion.span 
                  layoutId="underline"
                  className="absolute left-0 top-full block h-0.5 w-full bg-accent"
                />
              )}
            </Link>
          ))}
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="px-4 py-2 rounded-full bg-secondary hover:bg-opacity-70 transition-colors">
                Dashboard
              </Link>
              <button 
                onClick={logout} 
                className="px-4 py-2 rounded-full border border-accent text-accent hover:bg-accent hover:text-primary transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="px-4 py-2 rounded-full border border-accent text-accent hover:bg-accent hover:text-primary transition-colors"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-primary shadow-lg py-4 md:hidden"
          >
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className={`text-center py-2 ${location.pathname === item.path ? 'text-accent' : 'text-white'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {currentUser ? (
                <>
                  <Link 
                    to="/admin" 
                    className="text-center py-2 bg-secondary rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="py-2 rounded border border-accent text-accent"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="text-center py-2 rounded border border-accent text-accent"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;