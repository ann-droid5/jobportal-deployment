import axios from 'axios';

const api = axios.create({
  baseURL: 'https://job-portal-backend-jh4g.onrender.com/api',
});

export default api;
