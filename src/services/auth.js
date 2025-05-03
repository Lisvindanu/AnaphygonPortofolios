// src/services/auth.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Login user
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

// Check if user is authenticated
export const checkAuth = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Authentication failed');
  }
};