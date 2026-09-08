import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ecommerce-backend-k8n2.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token to every request automatically, if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
