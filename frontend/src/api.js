import axios from 'axios';

// Crea una instancia de Axios con configuración predeterminada
const api = axios.create({
  baseURL: 'https://classplay.cl/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agrega un interceptor para incluir el token en cada solicitud si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;