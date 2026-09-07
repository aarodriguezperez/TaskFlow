# TaskFlow

TaskFlow es una aplicación web para la gestión de proyectos y tareas, desarrollada con **React, TypeScript y Vite**.

Consume una API REST protegida mediante autenticación **JWT** y permite realizar operaciones CRUD sobre proyectos y sus tareas.

## App

https://aarodriguezperez.github.io/TaskFlow/

## Repositorio

https://github.com/aarodriguezperez/TaskFlow

---

## Funcionalidades

### Autenticación

- Inicio y cierre de sesión.
- Autenticación mediante JWT.
- Protección de rutas privadas.
- Envío automático del token mediante Axios.

### Proyectos

- Consultar proyectos.
- Crear proyectos.
- Editar proyectos.
- Eliminar proyectos.
- Acceder al detalle de cada proyecto.

### Tareas

Dentro de cada proyecto es posible:

- Consultar tareas.
- Crear tareas.
- Editar tareas.
- Eliminar tareas.
- Cambiar su estado.
- Definir prioridad.
- Asignar responsable.
- Definir fecha límite.

---

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Material UI
- Axios
- React Router
- JWT
- GitHub Actions
- GitHub Pages

---

## Arquitectura

El proyecto separa responsabilidades entre páginas, componentes, hooks, servicios y contexto.

```text
Page
  ↓
Hook
  ↓
Service
  ↓
Axios
  ↓
REST API
```

Ejemplo:

```text
ProjectPage
    ↓
useTasks(projectId)
    ↓
taskService
    ↓
GET /projects/{projectId}/tasks
```

---

## Estructura del proyecto

```text
src/
├── components/
├── config/
├── context/
├── hooks/
├── pages/
├── services/
├── App.tsx
├── main.tsx
├── ProtectedRoute.tsx
├── types.ts
└── vite-env.d.ts
```

### Carpetas principales

- `components`: componentes reutilizables, formularios, listas y diálogos.
- `pages`: vistas principales de la aplicación.
- `hooks`: lógica reutilizable y manejo de estado.
- `services`: comunicación con la API REST.
- `context`: manejo global de autenticación.
- `config`: configuración de la aplicación.

---

## Rutas

La aplicación utiliza **React Router**.

| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión |
| `/dashboard` | Administración de proyectos |
| `/projects/:projectId` | Proyecto seleccionado y sus tareas |

La ruta `/projects/:projectId` es dinámica y utiliza el ID del proyecto para consultar su información y tareas.

---

## Autenticación JWT

El flujo de autenticación es:

```text
Login
  ↓
POST /auth/login
  ↓
API devuelve JWT
  ↓
Token almacenado en localStorage
  ↓
AuthContext
  ↓
Axios agrega Authorization: Bearer <token>
```

Las rutas privadas utilizan `ProtectedRoute`. Si el usuario no está autenticado, es redirigido a `/login`.

---

## API

La comunicación con la API se realiza mediante una instancia centralizada de **Axios** (`httpClient`).

### Projects

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/projects` | Obtener proyectos |
| GET | `/projects/{id}` | Obtener un proyecto |
| POST | `/projects` | Crear proyecto |
| PUT | `/projects/{id}` | Actualizar proyecto |
| DELETE | `/projects/{id}` | Eliminar proyecto |
| GET | `/projects/{id}/tasks` | Obtener tareas del proyecto |

### Tasks

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/projects/{projectId}/tasks` | Crear tarea |
| PUT | `/tasks/{id}` | Actualizar tarea |
| DELETE | `/tasks/{id}` | Eliminar tarea |
| PATCH | `/tasks/{id}/status` | Cambiar estado |

---

## Tareas

Los estados disponibles son:

```text
TODO
IN_PROGRESS
DONE
```

Las prioridades disponibles son:

```text
LOW
MED
HIGH
```

Una tarea puede contener:

- título;
- descripción;
- prioridad;
- responsable;
- fecha límite;
- estado.

`PUT` se utiliza para actualizar los datos generales de una tarea, mientras que `PATCH` se utiliza únicamente para modificar su estado.

---

## Formularios y manejo de estado

La aplicación utiliza formularios controlados con React para crear y editar proyectos y tareas.

Los hooks administran estados como:

```text
loading
error
submitting
data
```

Después de realizar operaciones POST, PUT, PATCH o DELETE se actualizan los datos para mantener la interfaz sincronizada con la API.

---

## Interfaz

La interfaz fue desarrollada con **Material UI** e incluye:

- tema oscuro fijo personalizado mediante Material UI;
- cards para proyectos;
- dialogs para formularios;
- chips para información de tareas;
- botones e iconos para acciones;
- diseño responsive.

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/aarodriguezperez/TaskFlow.git
cd TaskFlow
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Generar build de producción:

```bash
npm run build
```

---

## GitHub Actions y Deploy

El proyecto utiliza **GitHub Actions** para instalar dependencias, compilar la aplicación y realizar el despliegue en **GitHub Pages**.

Flujo general:

```text
Checkout
   ↓
Node.js
   ↓
npm ci
   ↓
npm run build
   ↓
Deploy
```

La configuración de Vite utiliza:

```ts
base: '/TaskFlow/'
```

Aplicación desplegada:

https://aarodriguezperez.github.io/TaskFlow/

---

## Autor

**Alberto Alejandro Rodríguez Pérez**
