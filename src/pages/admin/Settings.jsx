import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

const Settings = () => {
  const { currentUser } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({
        show: true,
        message: 'New passwords do not match',
        type: 'error'
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setNotification({
        show: true,
        message: 'Password must be at least 6 characters',
        type: 'error'
      });
      return;
    }
    
    // In a real app, you would call an API to update the password
    // For this example, we'll simulate a successful update
    
    setTimeout(() => {
      setNotification({
        show: true,
        message: 'Password updated successfully',
        type: 'success'
      });
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 pb-12"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>
      
      {notification.show && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-md ${notification.type === 'success' ? 'bg-green-500 bg-opacity-10 text-green-500' : 'bg-red-500 bg-opacity-10 text-red-500'}`}
        >
          {notification.message}
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="glass-effect p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="font-medium">{currentUser?.username || 'Admin'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Role</p>
                <p className="font-medium">Administrator</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Login</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="glass-effect p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-6">Change Password</h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  required
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  required
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                />
              </div>
              
              <div className="pt-2">
                <Button type="submit" variant="gradient">
                  Update Password
                </Button>
              </div>
            </form>
          </div>
          
          <div className="glass-effect p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-6">Website Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-300 mb-1">
                  Website Title
                </label>
                <input
                  type="text"
                  id="siteTitle"
                  className="w-full px-4 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                  defaultValue="Portfolio 2025"
                />
              </div>
              
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-300 mb-1">
                  Meta Description
                </label>
                <textarea
                  id="siteDescription"
                  rows="3"
                  className="w-full px-4 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                  defaultValue="Professional portfolio showcasing creative development work and digital experiences."
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenance"
                  className="w-4 h-4 text-accent bg-secondary border-gray-700 rounded focus:ring-accent"
                  defaultChecked={false}
                />
                <label htmlFor="maintenance" className="ml-2 text-sm text-gray-300">
                  Enable Maintenance Mode
                </label>
              </div>
              
              <div>
                <Button variant="outline">
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
