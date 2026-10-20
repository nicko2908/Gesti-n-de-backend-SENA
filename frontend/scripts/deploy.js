/**
 * Copia el build del frontend (dist/) a la carpeta "public" del backend, que es
 * la que Express sirve en producción (ver backend/server.js).
 *
 * Se ejecuta con: npm run deploy:backend
 * (ese script primero hace "vite build" y luego este archivo).
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// frontend/scripts -> frontend -> proyecto -> backend/public
const distDir = path.resolve(__dirname, "..", "dist");
const backendPublic = path.resolve(__dirname, "..", "..", "backend", "public");

if (!existsSync(distDir)) {
  console.error('No existe "dist". Ejecuta primero "npm run build".');
  process.exit(1);
}

// Se limpia el public anterior para no dejar archivos viejos mezclados.
if (existsSync(backendPublic)) {
  rmSync(backendPublic, { recursive: true, force: true });
}
mkdirSync(backendPublic, { recursive: true });

cpSync(distDir, backendPublic, { recursive: true });

console.log(`Frontend copiado a: ${backendPublic}`);
console.log('Ahora ejecuta el backend con "npm start" y abre http://localhost:4500');
