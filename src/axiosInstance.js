import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // Your backend URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Get the token from local storage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Set the token in the Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;