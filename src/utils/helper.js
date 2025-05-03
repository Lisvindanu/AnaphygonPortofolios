// src/utils/helpers.js
// Format date string to readable format
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Truncate text with ellipsis
  export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  // Generate random ID
  export const generateId = (length = 8) => {
    return Math.random().toString(36).substring(2, length + 2);
  };
  
  // Debounce function
  export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  // Deep clone object
  export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  // Capitalize first letter of each word
  export const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  // Check if object is empty
  export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };
  
  // Get initials from name
  export const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  // Get random item from array
  export const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };
  
  // Sort array of objects by property
  export const sortByProperty = (array, property, order = 'asc') => {
    return [...array].sort((a, b) => {
      if (order === 'asc') {
        return a[property] > b[property] ? 1 : -1;
      } else {
        return a[property] < b[property] ? 1 : -1;
      }
    });
  };
  
  // Filter array of objects by search term
  export const filterBySearchTerm = (array, searchTerm, properties) => {
    if (!searchTerm) return array;
    
    const term = searchTerm.toLowerCase();
    
    return array.filter(item => {
      return properties.some(prop => {
        const value = item[prop];
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  };