// src/pages/admin/ContentEditor.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllContent, updateContent } from '../../services/api';
import Button from '../../components/common/Button';

const ContentEditor = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getAllContent();
        setSections(data);
        
        // Set first section as active by default
        if (Object.keys(data).length > 0) {
          setActiveSection(Object.keys(data)[0]);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      subtitle: item.subtitle || '',
      content: item.content || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateContent(editingItem.id, {
        ...formData,
        order_index: editingItem.order_index
      });
      
      // Update local state
      setSections(prev => ({
        ...prev,
        [activeSection]: prev[activeSection].map(item => 
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      }));
      
      // Show success notification
      setNotification({
        show: true,
        message: 'Content updated successfully!',
        type: 'success'
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating content:', error);
      
      // Show error notification
      setNotification({
        show: true,
        message: 'Error updating content. Please try again.',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-glow h-16 w-16 rounded-full bg-accent mb-4 mx-auto"></div>
          <p className="text-xl">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 pb-12"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Editor</h1>
        <p className="text-gray-400">Edit website content sections and information.</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="glass-effect p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Content Sections</h3>
            <nav className="space-y-2">
              {Object.keys(sections).map((section) => (
                <button
                  key={section}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeSection === section ? 'bg-accent text-primary' : 'hover:bg-secondary'}`}
                  onClick={() => setActiveSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="glass-effect p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
            </h3>
            
            {activeSection && sections[activeSection]?.length > 0 ? (
              <div className="space-y-6">
                {sections[activeSection].map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 border border-gray-700 rounded-lg hover:border-accent transition-colors ${editingItem?.id === item.id ? 'border-accent' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-medium">{item.title || 'No Title'}</h4>
                        <p className="text-sm text-gray-400">{item.subtitle || 'No Subtitle'}</p>
                      </div>
                      <button
                        className="px-3 py-1 bg-secondary rounded-md hover:bg-accent hover:text-primary transition-colors"
                        onClick={() => handleEditItem(item)}
                      >
                        Edit
                      </button>
                    </div>
                    
                    <p className="text-gray-300 line-clamp-2">{item.content || 'No content'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No content items found in this section.</p>
            )}
            
            {editingItem && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-8 border-t border-gray-700"
              >
                <h3 className="text-xl font-semibold mb-4">Edit Content</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-300 mb-1">
                      Subtitle
                    </label>
                    <input
                      id="subtitle"
                      name="subtitle"
                      type="text"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                      Content
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows="5"
                      value={formData.content}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-secondary text-white border border-gray-700 rounded-md focus:outline-none focus:ring-accent focus:border-accent"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => setEditingItem(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="gradient">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentEditor;