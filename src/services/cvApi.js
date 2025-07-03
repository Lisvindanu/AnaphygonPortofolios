// src/services/cvApi.js
import axios from 'axios';

// Use consistent API URL configuration
const getAPIUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        return 'https://api.vinmedia.my.id/api';
    }
    return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const API_URL = getAPIUrl();

const cvApi = axios.create({
    baseURL: `${API_URL}/cv`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
cvApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData (let axios handle it)
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

// Response interceptor for error handling
cvApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/admin/login';
            }

            throw new Error(data.message || 'CV API request failed');
        } else if (error.request) {
            throw new Error('Network error. Please check your connection.');
        } else {
            throw new Error('CV API request failed');
        }
    }
);

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
        headers: { 'Content-Type': 'multipart/form-data' }
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

export const toggleCVActive = async (id) => {
    const response = await cvApi.put(`/${id}/toggle-active`);
    return response.data;
};

// Function to get PDF as Blob data for preview
export const fetchCVAsBlob = async (id) => {
    const response = await cvApi.get(`/view/${id}`, {
        responseType: 'blob'
    });
    return response.data;
};

// Helper for direct download link
export const createDownloadLink = (id) => {
    return `${API_URL}/cv/download/${id}`;
};