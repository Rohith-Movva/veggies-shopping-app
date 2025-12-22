import axios from 'axios';

const API = axios.create({
  // Use the Render URL if available, otherwise use localhost
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Add logic to include token automatically
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;