# TaskFlow API

API de gestión de tareas construida con **Express 5**, **TypeScript** y **PostgreSQL**.

## Estado del proyecto

Proyecto en fase inicial — esqueleto funcional con conexión a base de datos y ruta de health check. Sin lógica de negocio implementada aún.

## Stack tecnológico

| Tecnología | Versión |
|---|---|
| Node.js | — |
| TypeScript | ^6.0.3 |
| Express | ^5.2.1 |
| PostgreSQL (pg) | ^8.22.0 |
| ts-node-dev | ^2.0.0 |

## Requisitos previos

- Node.js (v18 o superior)
- PostgreSQL corriendo localmente o en un servidor accesible

## Configuración

1. Clonar el repositorio e instalar dependencias:

```bash
npm install
```

2. Crear archivo `.env` en la raíz del proyecto (usar `.env.example` como referencia):

```env
PORT=3000
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/taskflow_db
NODE_ENV=development
```

3. Iniciar en modo desarrollo:

```bash
npm run dev
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor con recarga automática (hot-reload) |
| `npm run build` | Compila TypeScript a JavaScript en `dist/` |
| `npm start` | Ejecuta la compilación de producción |
| `npm test` | Placeholder — sin framework de tests configurado |

## Endpoints

### `GET /`
Información del proyecto.

```json
{
  "project": "TaskFlow API - Clase 1",
  "version": "1.0.0",
  "docs": "/health"
}
```

### `GET /health`
Verifica el estado de la API y la conexión a la base de datos.

**Respuesta exitosa (200):**
```json
{
  "status": "ok",
  "message": "TaskFlow API funcionando correctamente",
  "database": {
    "status": "connected",
    "timestamp": "2025-01-01T00:00:00.000Z"
  },
  "environment": "development"
}
```

**Error de base de datos (500):**
```json
{
  "status": "error",
  "message": "Error al conectar con la base de datos",
  "database": {
    "status": "disconnected"
  }
}
```

## Arquitectura

```
src/
├── index.ts                # Punto de entrada, configuración de Express y rutas
├── config/
│   └── database.ts         # Pool de conexión a PostgreSQL
└── routes/
    └── health.ts           # Ruta GET /health
```

- **Express 5** con middlewares de CORS, JSON y URL-encoded.
- **dotenv** carga variables de entorno desde `.env`.
- **pg.Pool** gestiona conexiones a PostgreSQL, verificadas al iniciar la aplicación.
- Manejo de errores 404 con respuesta JSON.

## Próximos pasos (ideas)

- [ ] Modelos y migraciones de base de datos
- [ ] CRUD de tareas
- [ ] Validación de datos
- [ ] Autenticación y autorización
- [ ] Tests automatizados
- [ ] Linter y formateador (ESLint + Prettier)
- [ ] CI/CD pipeline
