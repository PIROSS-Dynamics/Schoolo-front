import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/users/api', // Replace with your Django backend URL
});

export default api;