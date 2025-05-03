// src/pages/admin/SkillsManager.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllSkills, createSkill, updateSkill, deleteSkill } from '../../services/api';
import { motion } from 'framer-motion';

const SkillsManager = () => {
  const { currentUser } = useAuth();
  const [skills, setSkills] = useState([]);
  const [editSkill, setEditSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 0,
    icon: '',
    order_index: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      const data = await getAllSkills();
      setSkills(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError('Failed to load skills. Please try again.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'number' 
      ? parseInt(e.target.value, 10) || 0
      : e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (editSkill) {
        await updateSkill(editSkill.id, formData);
        showSuccessMessage('Skill updated successfully!');
      } else {
        await createSkill(formData);
        showSuccessMessage('New skill added successfully!');
      }
      await fetchSkills();
      resetForm();
    } catch (error) {
      console.error('Error saving skill:', error);
      setError('Failed to save skill. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setEditSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || '',
      order_index: skill.order_index
    });
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setIsLoading(true);
      try {
        await deleteSkill(id);
        showSuccessMessage('Skill deleted successfully!');
        await fetchSkills();
      } catch (error) {
        console.error('Error deleting skill:', error);
        setError('Failed to delete skill. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      proficiency: 0,
      icon: '',
      order_index: 0
    });
    setEditSkill(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const categoryOptions = [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'Mobile',
    'Design',
    'Tools',
    'Other'
  ];
  
  // Create an array of unique categories from existing skills
  const existingCategories = [...new Set(skills.map(skill => skill.category))];
  
  // Merge predefined options with existing categories (avoiding duplicates)
  const allCategories = [...new Set([...categoryOptions, ...existingCategories])];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">Manage Skills</h1>
        <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
      </motion.div>
      
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500 bg-opacity-20 border border-green-500 text-green-300 px-4 py-3 rounded mb-6 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </motion.div>
      )}
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded mb-6 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.div>
      )}
      
      {/* Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-6 mb-10"
      >
        <h2 className="text-2xl font-semibold mb-6 text-cyan-400 flex items-center">
          {editSkill ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Skill: {editSkill.name}
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Skill
            </>
          )}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Skill Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="e.g. React.js"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Category
            </label>
            <div className="relative">
              <select
                name="category"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white appearance-none"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select category</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Proficiency (%) - {formData.proficiency}%
            </label>
            <input
              type="range"
              name="proficiency"
              min="0"
              max="100"
              step="5"
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              value={formData.proficiency}
              onChange={handleInputChange}
              required
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Icon URL
            </label>
            <input
              type="text"
              name="icon"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              value={formData.icon}
              onChange={handleInputChange}
              placeholder="https://cdn.example.com/icons/react.svg"
            />
            <p className="text-xs text-gray-400">
              URL to an SVG or PNG icon (optional)
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Display Order
            </label>
            <input
              type="number"
              name="order_index"
              min="0"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              value={formData.order_index}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-400">
              Lower numbers appear first
            </p>
          </div>

          <div className="md:col-span-2 flex items-center space-x-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-md hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {editSkill ? 'Update Skill' : 'Add Skill'}
            </button>
            
            {editSkill && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>
      
      {/* Skills List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-semibold text-cyan-400 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Existing Skills
          </h2>
        </div>
        
        {isLoading && skills.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-xl">No skills found</p>
            <p className="mt-2">Add your first skill using the form above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Skill
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Proficiency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {skills.map((skill) => (
                  <motion.tr 
                    key={skill.id}
                    variants={itemVariants}
                    className="hover:bg-gray-800 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {skill.icon ? (
                          <img 
                            src={skill.icon} 
                            alt={skill.name} 
                            className="w-8 h-8 mr-3 object-contain bg-gray-700 p-1 rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/32?text=?';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 mr-3 bg-gray-700 rounded flex items-center justify-center text-gray-400">
                            ?
                          </div>
                        )}
                        <span className="font-medium">{skill.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400">{skill.proficiency}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {skill.order_index}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-cyan-400 hover:text-cyan-300 mr-4 transition-colors duration-150"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id, skill.name)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-150"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SkillsManager;