import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { join } from 'path'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: join(import.meta.dirname, 'src/quasar-variables.sass'),
    }),
  ],
  // Archivos estáticos (favicon, etc.) que Vite copia tal cual al build.
  publicDir: 'static',
  build: {
    // Build independiente dentro de la propia carpeta del frontend.
    // Para servirlo desde el backend ejecuta: npm run deploy:backend
    // (copia esta carpeta al "public" del backend).
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // En desarrollo las peticiones a /api se reenvían al backend (puerto 4500),
    // así el frontend puede usar siempre rutas relativas "/api/..." sin CORS.
    proxy: {
      '/api': 'http://localhost:4500',
    },
  },
})
