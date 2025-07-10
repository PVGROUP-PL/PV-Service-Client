// src/apiConfig.js
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://34.149.131.200' 
  : 'http://localhost:3000';

export default API_URL;