# 🎯 API Funko — Backend REST

API REST para la gestión de colecciones de Funko Pops. Construida con **Node.js**, **Express 5**, **TypeScript** y **MongoDB**.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Runtime | Node.js 20+ |
| Package Manager | **pnpm** 11+ |
| Framework | Express 5 |
| Lenguaje | TypeScript 6 |
| Base de datos | MongoDB + Mongoose 9 |
| Autenticación | JWT + Google OAuth 2.0 (Passport.js) |
| Almacenamiento de imágenes | Cloudinary |
| Validación | Zod 4 |
| Logging | Winston + Morgan |
| Seguridad | Helmet + CORS + Rate Limiting |

---

## 📁 Estructura del Proyecto

```
api-funko/
├── src/
│   ├── config/           # Configuración (env, cloudinary, passport, logger)
│   ├── errors/           # Clases de error personalizadas
│   ├── interfaces/       # Interfaces y tipos centralizados (barrel export)
│   ├── middleware/       # Auth, rate-limiter, upload, validación
│   ├── models/           # Modelos Mongoose (Funko, Series, User, Collection)
│   ├── modules/          # Módulos por dominio
│   │   ├── auth/         # Login, OAuth, JWT
│   │   ├── collection/   # Colección personal del usuario
│   │   ├── config/       # Configuración del frontend (variantes, tipos)
│   │   ├── funko/        # CRUD de Funkos
│   │   ├── health/       # Health check
│   │   ├── series/       # CRUD de Series
│   │   └── store/        # CRUD de Tiendas (stickers exclusivos)
│   ├── routes/           # Registro centralizado de rutas
│   ├── seeds/            # Seeds de datos iniciales
│   ├── utils/            # Helpers (apiResponse, xlsx-parser)
│   ├── app.ts            # Configuración de Express
│   └── server.ts         # Punto de entrada
├── .env                  # Variables de entorno (NO commitear)
├── .env.example          # Plantilla de variables de entorno
├── pnpm-lock.yaml        # Lockfile de pnpm
└── tsconfig.json
```

---

## ⚙️ Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd api-funko
pnpm install
```

> ⚠️ Este proyecto usa **pnpm** exclusivamente. Si intentas `npm install` o `yarn`, será bloqueado por el guard `preinstall`.

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales reales (ver sección [Variables de Entorno](#variables-de-entorno)).

### 3. Ejecutar en desarrollo

```bash
pnpm run dev
```

### 4. Compilar para producción

```bash
pnpm run build
pnpm start
```

### 5. Ejecutar seeds

```bash
pnpm run seed
pnpm exec ts-node src/seeds/store.seed.ts
```

---

## 🔑 Variables de Entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `PORT` | Puerto del servidor (default: 3000) | No |
| `NODE_ENV` | `development` / `production` | No |
| `MONGODB_URI` | URI de conexión a MongoDB | ✅ |
| `FRONTEND_URL` | URL del frontend (CORS) | ✅ |
| `GOOGLE_CLIENT_ID` | Client ID de Google OAuth | ✅ |
| `GOOGLE_CLIENT_SECRET` | Client Secret de Google OAuth | ✅ |
| `JWT_SECRET` | Clave secreta para firmar JWT (mín. 32 chars) | ✅ |
| `ADMIN_EMAIL` | Email que recibe rol Admin automáticamente | No |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary | ✅ |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary | ✅ |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary | ✅ |

---

## 📡 Endpoints Principales

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/auth/google` | Iniciar OAuth con Google |
| `GET` | `/auth/google/callback` | Callback de Google OAuth |
| `POST` | `/api/auth/logout` | Cerrar sesión |
| `GET` | `/api/auth/me` | Usuario autenticado |

### Series
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/series` | Listar todas las series | No |
| `POST` | `/api/series` | Crear serie | Admin |
| `PUT` | `/api/series/:id` | Actualizar serie | Admin |
| `DELETE` | `/api/series/:id` | Eliminar serie | Admin |
| `POST` | `/api/series/:id/image` | Subir imagen a Cloudinary | Admin |

### Funkos
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/funkos` | Listar funkos (paginado + filtros) | No |
| `POST` | `/api/funkos` | Crear funko | Admin |
| `PUT` | `/api/funkos/:id` | Actualizar funko | Admin |
| `DELETE` | `/api/funkos/:id` | Eliminar funko | Admin |
| `POST` | `/api/funkos/:id/image` | Subir imagen a Cloudinary | Admin |

### Mi Colección
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/collection` | Ver mi colección | ✅ |
| `POST` | `/api/collection/:seriesId` | Agregar serie | ✅ |
| `DELETE` | `/api/collection/:seriesId` | Quitar serie | ✅ |
| `GET` | `/api/collection/:slug` | Checklist de una serie | ✅ |
| `POST` | `/api/collection/:slug/:funkoId` | Marcar funko como poseído | ✅ |
| `DELETE` | `/api/collection/:slug/:funkoId` | Desmarcar funko | ✅ |

---

## 🖼️ Almacenamiento de Imágenes

Las imágenes se suben directamente a **Cloudinary** organizadas en:

```
kokelagos/
└── api-funko/
    ├── series/     → logos de series
    └── funkos/     → imágenes de funkos
```

Al eliminar una serie o funko, la imagen se elimina automáticamente de Cloudinary.

---

## 🛡️ Seguridad

- **pnpm** — strict dependency isolation, verificación de integridad de paquetes
- **Helmet** — headers HTTP seguros
- **CORS** — solo permite el `FRONTEND_URL` configurado
- **Rate Limiting** — 500 req/min en desarrollo, 120 req/min en producción
- **JWT** — tokens firmados para proteger rutas autenticadas
- **Roles** — `admin` y `user` con guardias en cada ruta

---

## 🧪 Health Check

```
GET /api/health
→ { "status": "ok", "timestamp": "..." }
```
