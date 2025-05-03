// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full glass-effect p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gradient">Admin Login</h2>
          <p className="mt-2 text-gray-400">Enter your credentials to access the admin panel</p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 py-2 px-4 rounded mb-4"
          >
            {error}
          </motion.div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="appearance-none bg-secondary text-white relative block w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
              placeholder="Username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none bg-secondary text-white relative block w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
              placeholder="Password"
            />
          </div>
          
          <div>
            <Button
              type="submit"
              variant="gradient"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;