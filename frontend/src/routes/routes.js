import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

import LoginView from '../views/LoginView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import CursosView from '../views/CursosView.vue'
import AprendicesView from '../views/AprendicesView.vue'
import UsuariosView from '../views/UsuariosView.vue'

const routes = [
  // La app inicia directamente en el login (sin landing intermedia).
  { path: '/', redirect: { name: 'login' } },
  { path: '/login', name: 'login', component: LoginView },
  {
    // Todo lo que esté bajo /dashboard requiere sesión (meta.requiresAuth).
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: DashboardView },
      { path: 'cursos', name: 'cursos', component: CursosView },
      { path: 'aprendices', name: 'aprendices', component: AprendicesView },
      { path: 'usuarios', name: 'usuarios', component: UsuariosView, meta: { requiresAdmin: true } },
    ],
  },
  // Cualquier URL desconocida (incluida la antigua /dashboard/instructores)
  // vuelve al panel principal.
  { path: '/:pathMatch(.*)*', redirect: { name: 'dashboard' } },
]

const router = createRouter({
  routes,
  history: createWebHashHistory(),
})

// Guarda global de navegación: protege las rutas privadas y evita volver al
// login si ya hay sesión iniciada.
router.beforeEach((to) => {
  const auth = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (requiresAdmin && auth.usuario?.rol !== 'ADMIN') {
    return { name: 'dashboard' }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export { router }
