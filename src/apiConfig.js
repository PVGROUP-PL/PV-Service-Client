// src/apiConfig.js

// URL dla zapytań fetch (HTTP), które będą przekierowywane przez Firebase
export const API_URL = ''; 

// Pełny URL dla bezpośrednich połączeń (np. Socket.IO)
export const SOCKET_URL = 'https://pv-service-backend-1095388661827.europe-central2.run.app';

// Możemy też wyeksportować domyślnie API_URL dla uproszczenia
const DEFAULT_URL = API_URL;
export default DEFAULT_URL;