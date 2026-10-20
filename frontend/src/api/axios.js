import axios from 'axios'
import { useAuthStore } from '../stores/auth.js'

// Instancia única de Axios para TODA la aplicación (en lugar de usar fetch).
//
// - baseURL: en desarrollo Vite redirige "/api" al backend vía proxy
//   (ver vite.config.js); en producción el propio backend sirve el frontend,
//   así que "/api" apunta al mismo servidor.
// - El interceptor de petición agrega la cabecera "x-token" con el token de
//   sesión, que es lo que valida el middleware validateJWT del backend.
// - El interceptor de respuesta cierra la sesión y vuelve al login cuando el
//   backend responde 401 (token ausente, vencido o usuario inactivo).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers['x-token'] = auth.token
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const auth = useAuthStore()
    if (error.response && error.response.status === 401) {
      auth.logout()
      window.location.hash = '#/login'
    }
    return Promise.reject(error)
  }
)

export default api
