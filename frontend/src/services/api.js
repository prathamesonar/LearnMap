import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for map generation
});

apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`📥 Response:`, response.data);
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);


export const getLearningMap = async (topic, level) => {
  try {
    const response = await apiClient.post('/generate-map', {
      topic: topic.trim(),
      level,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to generate map');
    }

    return response.data;
  } catch (error) {
    const message = 
      error.response?.data?.message || 
      error.message || 
      'Failed to generate learning map. Please try again.';
    throw new Error(message);
  }
};

export default apiClient;