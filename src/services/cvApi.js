// src/services/cvApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://api.vinmedia.my.id/api';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const cvApi = axios.create({
    baseURL: `${API_URL}/cv`,
    headers: {
        'Content-Type': 'application/json'
    }
});

cvApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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

// Fungsi untuk mendapatkan PDF sebagai data Blob untuk pratinjau
export const fetchCVAsBlob = async (id) => {
    const response = await cvApi.get(`/view/${id}`, {
        responseType: 'blob'
    });
    return response.data; // Langsung kembalikan data blob
};

// Helper untuk link download langsung
export const createDownloadLink = (id) => {
    return `${API_URL}/cv/download/${id}`;
};