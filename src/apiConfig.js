// src/apiConfig.js
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://pv-service-backend-b0y53bb61027-europe-central2.run.app' 
  : 'http://localhost:3000';

export default API_URL;