# Proyecto Full-Stack (backend + frontend separados)

Proyecto de práctica con el **backend** y el **frontend** en carpetas
independientes, cada una con sus propias dependencias.

- **`backend/`** → API REST con **Express + MongoDB (Mongoose) + JWT**.
- **`frontend/`** → SPA con **Vue 3 + Vite + Quasar + Pinia + Axios**.

## Estructura

```
proyecto/
├── backend/                  API REST (Express + MongoDB)
│   ├── app.js                Punto de entrada (arranca el servidor)
│   ├── server.js             Clase Server (middlewares, rutas, estáticos)
│   ├── database.js           Conexión a MongoDB
│   ├── controller/           Lógica de cada recurso
│   ├── models/               Esquemas de Mongoose
│   ├── routes/               Rutas /api/*
│   ├── validations/          Reglas de express-validator
│   ├── helpers/              Consultas de apoyo y generación de JWT
│   ├── middlewares/          validateJWT, validateFields
│   ├── scripts/seed.js       Datos de ejemplo
│   ├── public/               Build del frontend que sirve este servidor
│   └── package.json
│
└── frontend/                 SPA (Vue + Quasar)
    ├── src/                  Código de la aplicación
    ├── index.html
    ├── static/               Archivos estáticos (favicon...)
    ├── scripts/deploy.js     Copia el build al backend
    ├── vite.config.js
    └── package.json
```

## Requisitos

- Node.js (>= 20.11, recomendado 22/24)
- MongoDB corriendo en `mongodb://127.0.0.1:27017` (o la URL que pongas en `.env`)

## Instalación

Las dependencias se instalan **por separado** en cada carpeta:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Configuración del backend

Copia el archivo de ejemplo y ajusta los valores:

```bash
cd backend
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `MONGO_URL` | Cadena de conexión a MongoDB |
| `PORT` | Puerto del backend (por defecto `4500`) |
| `SECRETORPRIVATEKEY` | Clave para firmar los tokens JWT |

## Base de datos (seed)

```bash
cd backend
npm run seed          # inserta cursos, 100 aprendices y el usuario admin
npm run seed:reset    # borra todo y vuelve a insertar
```

Credenciales de prueba que crea el seed:

- email: `admin@sena.edu.co`
- contraseña: `123456`

## Modo desarrollo

Levanta **dos terminales** (una por carpeta):

```bash
# Terminal 1: backend (Express + MongoDB) en http://localhost:4500
cd backend
npm run dev

# Terminal 2: frontend (Vite) en http://localhost:5173
cd frontend
npm run dev
```

En desarrollo, Vite redirige (`proxy`) las peticiones a `/api/*` hacia el
backend (`http://localhost:4500`), así no hay problemas de CORS.

## Modo producción

El backend sirve el frontend ya compilado desde su carpeta `public/`:

```bash
# 1) Compila el frontend y cópialo al backend
cd frontend
npm run deploy:backend

# 2) El backend sirve el frontend compilado y la API al mismo tiempo
cd ../backend
npm start
```

Abre `http://localhost:4500`.

> `npm run deploy:backend` ejecuta el build de Vite (`dist/`) y luego
> `scripts/deploy.js` copia el resultado a `backend/public/`.

## API disponible

| Método | Ruta | Descripción | Token |
|---|---|---|---|
| POST | `/api/usuarios/login` | Iniciar sesión (devuelve token) | no |
| POST | `/api/usuarios/register` | Crear usuario | sí |
| GET | `/api/cursos` | Listar cursos | sí |
| GET | `/api/cursos/:id` | Obtener un curso | sí |
| POST | `/api/cursos/register` | Crear curso | sí |
| PUT | `/api/cursos/update/:id` | Actualizar curso | sí |
| PUT | `/api/cursos/active/:id` | Activar curso | sí |
| PUT | `/api/cursos/inactive/:id` | Desactivar curso | sí |
| GET | `/api/aprendices` | Listar aprendices | sí |
| GET | `/api/aprendices/curso/:curso` | Aprendices de un curso | sí |
| GET | `/api/aprendices/:id` | Obtener un aprendiz | sí |
| POST | `/api/aprendices/register` | Crear aprendiz | sí |
| PUT | `/api/aprendices/update/:id` | Actualizar aprendiz | sí |
| PUT | `/api/aprendices/active/:id` | Activar aprendiz | sí |
| PUT | `/api/aprendices/inactive/:id` | Desactivar aprendiz | sí |

El token viaja en la cabecera **`x-token`** (el interceptor de Axios la agrega
automáticamente al iniciar sesión).

## Documentación del frontend

La configuración detallada del frontend (Vite, Quasar, Pinia, etc.) está en
[`frontend/ANALISIS-CONFIGURACION.md`](./frontend/ANALISIS-CONFIGURACION.md).
