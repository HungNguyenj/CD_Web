import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/bookstore/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Unwrap the data from the API response
        if (response.data && response.data.hasOwnProperty('data')) {
            return response.data.data;
        }
        return response.data;
    },
    (error) => {
        if (error.response && error.response.data) {
            // Handle API error messages
            const errorMessage = error.response.data.message || 'An error occurred';
            return Promise.reject(new Error(errorMessage));
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 