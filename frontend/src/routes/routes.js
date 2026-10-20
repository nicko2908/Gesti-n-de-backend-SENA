import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

import LoginView from '../views/LoginView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import CursosView from '../views/CursosView.vue'
import AprendicesView from '../views/AprendicesView.vue'
import InstructoresView from '../views/InstructoresView.vue'

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
      { path: 'instructores', name: 'instructores', component: InstructoresView },
    ],
  },
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

  if (requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export { router }
