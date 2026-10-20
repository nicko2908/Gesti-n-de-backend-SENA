import { createApp } from 'vue'
import { Quasar, Dialog, Notify, Loading, Dark, Lang } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import langEs from 'quasar/lang/es'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import { router } from './routes/routes.js'
import './style.css'
import './styles/tables.css'
import './styles/forms.css'

const app = createApp(App)

// Pinia (store global). Se registra ANTES que el router porque las guardas de
// ruta usan los stores (useAuthStore) para saber si hay sesión.
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Quasar. Aquí se habilitan los plugins que usan las vistas (Notify para los
// mensajes del backend, Dialog, Loading y Dark para el modo oscuro). Sin esto
// $q.notify / $q.dialog / $q.dark no estarían disponibles.
app.use(Quasar, {
  plugins: { Dialog, Notify, Loading, Dark },
})

// Textos de Quasar (paginación, selects, etc.) en español.
Lang.set(langEs)

// Restaura el tema guardado (claro/oscuro) antes de montar la app.
Dark.set(localStorage.getItem('guaika-dark') === 'true')

app.use(router)

app.mount('#app')
