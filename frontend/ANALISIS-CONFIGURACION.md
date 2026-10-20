# Análisis de Configuración — "tercer proyecto"

> Documento generado a partir del análisis de la carpeta `tercer proyecto`.

## Conclusión rápida

El proyecto usa **Vue 3 + Vite en JavaScript puro (sin TypeScript)**, con **Quasar** como framework UI, **Pinia** como store y **pinia-plugin-persistedstate** para persistir el estado. No hay rastros de TypeScript.

---

## 1. Vite / Vue (sin TypeScript)

**Confirmado: NO hay TypeScript.** No existe `tsconfig.json` ni archivos `.ts`/`.tsx`; todo el código es `.js` y `.vue`.

| Dependencia | Versión | Rol |
|---|---|---|
| `vite` | ^8.2.2 | Bundler / dev server |
| `@vitejs/plugin-vue` | ^6.0.8 | Compila SFC `.vue` |
| `vue` | ^3.5.41 | Framework |
| `vue-router` | ^5.3.1 | Enrutado |

### `vite.config.js`

```js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { join } from 'path'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: join(import.meta.dirname, 'src/quasar-variables.sass')
    })
  ]
})
```

- Plugin `vue()` con `template: { transformAssetUrls }` (necesario para que Quasar resuelva assets en plantillas).
- Plugin `quasar()` apuntando a `src/quasar-variables.sass`.

### `index.html`

- Monta el contenedor `#app`.
- Carga el entry point `/src/main.js`.

---

## 2. Quasar

| Dependencia | Versión | Rol |
|---|---|---|
| `quasar` | ^2.32.3 | Framework UI |
| `@quasar/vite-plugin` | ^2.0.2 | Integración con Vite |
| `@quasar/extras` | ^2.1.0 | Iconos / webfonts (aquí: Material Icons) |
| `sass-embedded` | ^1.104.1 | Compila los `.sass` de Quasar |

### Registro en `src/main.js`

```js
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

app.use(Quasar, { plugins: {} })
```

### Variables de tema — `src/quasar-variables.sass`

```sass
$primary   : #1976D2
$secondary : #26A69A
$accent    : #9C27B0
$dark      : #1D1D1D
$positive  : #21BA45
$negative  : #C10015
$info      : #31CCEC
$warning   : #F2C037
```

> ⚠️ Detalle: `app.use(Quasar, { plugins: {} })` no registra ningún plugin de Quasar (Dialog, Notify, Loading, etc.). Si las vistas usan `this.$q.dialog`, `$q.notify` u otros, habrá que habilitarlos en ese objeto `plugins`.

---

## 3. Pinia

| Dependencia | Versión |
|---|---|
| `pinia` | ^4.0.3 |

### Registro en `src/main.js`

```js
import { createPinia } from 'pinia'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
```

### Store de ejemplo — `src/stores/stores.js`

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() { this.count++ },
    decrement() { this.count-- },
  },
  persist: true, // => Activa localStorage
})
```

---

## 4. pinia-plugin-persistedstate

| Dependencia | Versión |
|---|---|
| `pinia-plugin-persistedstate` | ^4.7.1 |

### Configuración

- Registrado globalmente en `main.js` con `pinia.use(piniaPluginPersistedstate)`.
- Activado por store mediante la opción `persist: true`.
- Por defecto persiste en `localStorage` bajo la clave del id del store (`counter`).
- No hay configuración avanzada (`key`, `paths`, `storage` personalizado, etc.).

---

## Estructura general de `src/`

| Archivo / Carpeta | Descripción |
|---|---|
| `main.js` | Bootstrap (Vue + Quasar + Pinia + router) |
| `App.vue` | `<router-view />` + variables CSS globales (`--color-principal`, etc.) |
| `routes/routes.js` | Router con `createWebHashHistory()` y 5 rutas |
| `stores/stores.js` | Store de ejemplo (counter) |
| `views/` | 5 vistas: `MainPage`, `LoginAlumno`, `LoginDocente`, `MainPageAlumno`, `MainPageDocente` |
| `components/` | `HelloWorld.vue` (template por defecto) |
| `quasar-variables.sass` | Variables de tema de Quasar |
| `style.css` | Estilos base |

### Rutas definidas — `src/routes/routes.js`

| Ruta | Componente |
|---|---|
| `/` | `MainPage` |
| `/login/alumno` | `LoginAlumno` |
| `/login/docente` | `LoginDocente` |
| `/dashboard/alumno` | `MainPageAlumno` |
| `/dashboard/docente` | `MainPageDocente` |

```js
export const router = createRouter({
  routes,
  history: createWebHashHistory()
})
```

---

## Observaciones / posibles puntos de atención

1. **Versiones muy nuevas**: `vite@8` y `vue-router@5` son versiones recientes; conviene verificar compatibilidad con `@quasar/vite-plugin@2` ante posibles warnings de instalación.
2. **Quasar sin plugins**: el objeto `plugins: {}` está vacío.
3. **Store de ejemplo** (`counter`) no se usa en las vistas actuales.
4. **README.md** sigue siendo el template genérico "Vue 3 + Vite".
