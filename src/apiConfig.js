// src/apiConfig.js

// Ten adres jest pusty, aby zapytania fetch (np. o listę profili) działały z Firebase rewrites
export const API_URL = '';

// Ten adres jest pełny i służy do bezpośrednich połączeń, których nie obsługuje rewrite,
// takich jak Socket.IO oraz ładowanie obrazków.
const DIRECT_URL = 'https://pv-service-backend-1095388661827.europe-central2.run.app';

export const SOCKET_URL = DIRECT_URL;
export const DIRECT_BACKEND_URL = DIRECT_URL;

export default API_URL;