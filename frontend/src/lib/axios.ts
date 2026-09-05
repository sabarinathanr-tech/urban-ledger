import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Automatically inject JWT token from localStorage into every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('urban_ledger_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Format API errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn('API returned 401 Unauthorized.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
