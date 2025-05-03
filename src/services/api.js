// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Content API
export const getAllContent = async () => {
  const response = await api.get('/content');
  return response.data;
};

export const getContentBySection = async (section) => {
  const response = await api.get(`/content/${section}`);
  return response.data;
};

export const updateContent = async (id, data) => {
  const response = await api.put(`/content/${id}`, data);
  return response.data;
};

// Projects API
export const getAllProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data) => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

// Skills API
export const getAllSkills = async () => {
  const response = await api.get('/skills');
  return response.data;
};

export const getSkillById = async (id) => {
  const response = await api.get(`/skills/${id}`);
  return response.data;
};

export const createSkill = async (data) => {
  const response = await api.post('/skills', data);
  return response.data;
};

export const updateSkill = async (id, data) => {
  const response = await api.put(`/skills/${id}`, data);
  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await api.delete(`/skills/${id}`);
  return response.data;
};