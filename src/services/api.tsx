import axios from 'axios';
import { verifyToken } from './jwtService';

const baseUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: baseUrl
});

// Add a request interceptor to add the Authorization header to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenValidity = verifyToken(token);
        if(tokenValidity){
          config.headers['Content-Type'] = 'application/json';
          config.headers['Authorization'] = `Bearer ${token}`;
        }else{
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } catch (err) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return config;
  }, 
  (error) => {
    return Promise.reject(error)
  }
);
  
  // Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export default api;