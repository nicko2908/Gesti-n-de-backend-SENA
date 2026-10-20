import { defineStore } from 'pinia'
import api from '../api/axios.js'

// Store de autenticación. Guarda el token y el usuario que devuelve el login.
// Al tener "persist: true", sobrevive a recargar la página (localStorage), de
// modo que la sesión se mantiene abierta.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    usuario: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email, password) {
      const { data } = await api.post('/usuarios/login', { email, password })
      this.token = data.token
      this.usuario = data.usuario
      return data
    },
    logout() {
      this.token = null
      this.usuario = null
    },
  },
  persist: true,
})
