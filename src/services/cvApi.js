// src/services/cvApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance for CV operations
const cvApi = axios.create({
    baseURL: `${API_URL}/cv`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
cvApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// CV API functions
export const getAllCVs = async () => {
    const response = await cvApi.get('/');
    return response.data;
};

export const getCVById = async (id) => {
    const response = await cvApi.get(`/${id}`);
    return response.data;
};

export const uploadCV = async (formData) => {
    const response = await cvApi.post('/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const updateCV = async (id, data) => {
    const response = await cvApi.put(`/${id}`, data);
    return response.data;
};

export const deleteCV = async (id) => {
    const response = await cvApi.delete(`/${id}`);
    return response.data;
};

export const downloadCV = async (id) => {
    const response = await cvApi.get(`/download/${id}`, {
        responseType: 'blob'
    });
    return response;
};

export const toggleCVActive = async (id) => {
    const response = await cvApi.put(`/${id}/toggle-active`);
    return response.data;
};

// Helper function to create download link
export const createDownloadLink = (id, filename) => {
    return `${API_URL}/cv/download/${id}`;
};