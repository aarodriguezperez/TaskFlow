# TaskFlow

TaskFlow es una aplicación web para la gestión de proyectos y tareas, desarrollada con **React, TypeScript y Vite**.

La aplicación consume una API REST protegida mediante autenticación **JWT** y permite administrar proyectos y las tareas asociadas a cada uno mediante operaciones CRUD.

## Demo

Aplicación desplegada en GitHub Pages:

https://aarodriguezperez.github.io/TaskFlow/

## Repositorio

https://github.com/aarodriguezperez/TaskFlow

---

## Funcionalidades

### Autenticación

- Inicio de sesión mediante usuario y contraseña.
- Autenticación basada en JWT.
- Cierre de sesión.

### Proyectos

La pantalla principal muestra los proyectos disponibles en formato de cards.

Es posible:

- Consultar todos los proyectos.
- Crear un nuevo proyecto.
- Editar un proyecto.
- Eliminar un proyecto.
- Abrir una página independiente para administrar cada proyecto.

### Tareas

Cada proyecto cuenta con su propia página para administrar sus tareas.

Es posible:

- Consultar las tareas de un proyecto.
- Crear una nueva tarea.
- Editar una tarea.
- Eliminar una tarea.
- Modificar el estado de una tarea.
- Definir prioridad.
- Asignar un responsable.
- Definir una fecha límite.

---

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Material UI
- Axios
- React Router
- JWT
- Git
- GitHub
- GitHub Actions
- GitHub Pages

---

## Arquitectura del frontend

El proyecto separa las responsabilidades principales entre páginas, componentes, hooks, servicios y contexto.

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

Por ejemplo, para consultar las tareas de un proyecto:

```text
ProjectPage
    ↓
useTasks(projectId)
    ↓
taskService
    ↓
httpClient
    ↓
GET /projects/{projectId}/tasks
```

Esta separación permite mantener la lógica de consumo de la API fuera de los componentes visuales.

---

## Estructura del proyecto

```text
src/
├── components/
│   ├── ProjectEditDialog.tsx
│   ├── ProjectForm.tsx
│   ├── ProjectList.tsx
│   ├── TaskEditDialog.tsx
│   ├── TaskForm.tsx
│   └── TaskList.tsx
│
├── config/
│   └── apiUrl.ts
│
├── context/
│   └── AuthContext.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useProject.ts
│   ├── useProjectForm.ts
│   ├── useProjects.ts
│   ├── useTaskForm.ts
│   └── useTasks.ts
│
├── pages/
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   └── ProjectPage.tsx
│
├── services/
│   ├── authService.ts
│   ├── httpClient.ts
│   ├── projectService.ts
│   └── taskService.ts
│
├── App.tsx
├── main.tsx
├── ProtectedRoute.tsx
├── types.ts
└── vite-env.d.ts
```

### `components`

Contiene los componentes reutilizables de la interfaz.

Entre ellos se encuentran:

- formularios para proyectos y tareas;
- listas y cards;
- diálogos de edición;
- controles para cambiar estados;
- botones de edición y eliminación.

### `pages`

Contiene las vistas principales de la aplicación.

- `LoginPage.tsx`: inicio de sesión.
- `DashboardPage.tsx`: listado y administración de proyectos.
- `ProjectPage.tsx`: detalle de un proyecto y administración de sus tareas.

### `hooks`

Encapsula lógica reutilizable relacionada con carga de datos, formularios y estado.

Ejemplos:

- `useProjects`
- `useProject`
- `useTasks`
- `useProjectForm`
- `useTaskForm`
- `useAuth`

### `services`

Contiene la comunicación con la API REST.

- `authService.ts`
- `projectService.ts`
- `taskService.ts`
- `httpClient.ts`

### `context`

`AuthContext` centraliza el estado de autenticación de la aplicación.

### `config`

Contiene configuraciones reutilizables, como la URL base de la API.

---

## Rutas

La aplicación utiliza **React Router**.

| Ruta | Descripción |
|---|---|
| `/login` | Pantalla de inicio de sesión |
| `/dashboard` | Administración de proyectos |
| `/projects/:projectId` | Detalle de un proyecto y sus tareas |

La ruta:

```text
/projects/:projectId
```

es dinámica.

Por ejemplo:

```text
/projects/45
```

carga la información del proyecto con ID `45` y posteriormente consulta sus tareas.

---

## Autenticación JWT

El proceso de autenticación funciona de la siguiente manera:

```text
Login
  ↓
POST /auth/login
  ↓
API devuelve JWT
  ↓
Token almacenado en localStorage
  ↓
AuthContext mantiene el estado de autenticación
  ↓
Axios agrega el token a las peticiones
```

Las peticiones autenticadas incluyen el header:

```http
Authorization: Bearer <token>
```

El cliente Axios utiliza un interceptor para agregar automáticamente el token cuando está disponible.

---

## Rutas protegidas

Las páginas privadas se encuentran protegidas mediante `ProtectedRoute`.

Si el usuario no tiene una sesión válida, no puede acceder directamente a:

```text
/dashboard
/projects/:projectId
```

y es redirigido hacia:

```text
/login
```

---

## Consumo de la API

La comunicación con la API se realiza mediante **Axios**.

Se utiliza una instancia centralizada:

```text
httpClient
```

que define:

- URL base de la API.
- Header `Content-Type`.
- Token JWT.
- Manejo común de errores HTTP.

---

# Endpoints implementados

## Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/login` | Iniciar sesión y obtener JWT |

---

## Projects

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/projects` | Obtener todos los proyectos |
| GET | `/projects/{id}` | Obtener un proyecto por ID |
| POST | `/projects` | Crear un proyecto |
| PUT | `/projects/{id}` | Actualizar un proyecto |
| DELETE | `/projects/{id}` | Eliminar un proyecto |
| GET | `/projects/{id}/tasks` | Obtener las tareas de un proyecto |

---

## Tasks

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/projects/{projectId}/tasks` | Crear una tarea dentro de un proyecto |
| PUT | `/tasks/{id}` | Actualizar los datos de una tarea |
| DELETE | `/tasks/{id}` | Eliminar una tarea |
| PATCH | `/tasks/{id}/status` | Actualizar únicamente el estado |

---

## Relación entre Projects y Tasks

Una tarea pertenece a un proyecto.

```text
Project
   │
   ├── Task
   ├── Task
   └── Task
```

Por este motivo, para crear una tarea se utiliza el ID del proyecto en la URL:

```http
POST /projects/{projectId}/tasks
```

Ejemplo:

```http
POST /projects/45/tasks
```

Para consultar las tareas de ese proyecto:

```http
GET /projects/45/tasks
```

---

## Tareas

Una tarea contiene información como:

```text
Título
Descripción
Estado
Prioridad
Responsable
Fecha límite
Proyecto
```

### Estados

Los estados disponibles son:

```text
TODO
IN_PROGRESS
DONE
```

El estado se modifica utilizando:

```http
PATCH /tasks/{id}/status
```

Por ejemplo:

```json
{
  "status": "IN_PROGRESS"
}
```

### Prioridades

Las prioridades disponibles son:

```text
LOW
MED
HIGH
```

### Responsable

Las tareas pueden tener un responsable mediante:

```text
assigneeId
```

Una tarea debe contar con un responsable asignado para poder pasar al estado:

```text
DONE
```

---

## PUT y PATCH

La aplicación utiliza ambos métodos dependiendo del tipo de actualización.

### PUT

Se utiliza para actualizar los datos generales de un recurso.

Ejemplo:

```http
PUT /tasks/{id}
```

Puede modificar datos como:

- título;
- descripción;
- prioridad;
- responsable;
- fecha límite.

### PATCH

Se utiliza para modificar únicamente una parte específica del recurso.

En TaskFlow se utiliza para actualizar solamente el estado:

```http
PATCH /tasks/{id}/status
```

---

## Formularios

La aplicación incluye formularios para:

- crear proyectos;
- editar proyectos;
- crear tareas;
- editar tareas.

Los formularios utilizan estado controlado mediante React.

Entre los campos utilizados se encuentran:

### Proyecto

- Nombre.
- Descripción.

### Tarea

- Título.
- Descripción.
- Prioridad.
- Responsable.
- Fecha límite.

Los formularios también controlan estados como:

```text
submitting
error
valid
```

para evitar envíos inválidos o múltiples peticiones simultáneas.

---

## Manejo de estado

Los hooks manejan estados relacionados con las peticiones HTTP.

Por ejemplo:

```text
loading
error
data
refetch
```

Esto permite representar diferentes estados en la interfaz.

```text
Petición iniciada
      ↓
loading = true
      ↓
API
  ├── éxito → actualizar datos
  └── error → mostrar mensaje
      ↓
loading = false
```

Después de operaciones como POST, PUT, DELETE o PATCH se realiza un `refetch` para mantener la interfaz sincronizada con la API.

---

## Interfaz

La interfaz fue desarrollada utilizando **Material UI**.

El diseño utiliza:

- modo oscuro;
- cards para proyectos;
- dialogs para formularios;
- chips para información de tareas;
- botones e iconos para acciones;
- diseño responsive.

El Dashboard muestra los proyectos en cards.

Al seleccionar un proyecto se navega a una ruta independiente:

```text
/projects/:projectId
```

desde donde se administran sus tareas.

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/aarodriguezperez/TaskFlow.git
```

Entrar al proyecto:

```bash
cd TaskFlow
```

Instalar dependencias:

```bash
npm install
```

También puede utilizarse:

```bash
npm ci
```

cuando existe un `package-lock.json`.

---

## Ejecutar en desarrollo

```bash
npm run dev
```

Vite mostrará en la terminal la URL local de la aplicación.

Normalmente:

```text
http://localhost:5173/TaskFlow/
```

---

## Build de producción

Para comprobar que TypeScript y Vite pueden generar correctamente la aplicación:

```bash
npm run build
```

El proceso genera los archivos de producción dentro de:

```text
dist/
```

---

## GitHub Actions

El proyecto utiliza **GitHub Actions** para automatizar el proceso de integración y despliegue.

El workflow realiza tareas como:

```text
Checkout
   ↓
Configurar Node.js
   ↓
npm ci
   ↓
npm run build
   ↓
Generar artefacto
   ↓
Deploy
```

Esto permite validar automáticamente que el proyecto pueda instalar dependencias y compilar correctamente.

---

## GitHub Pages

La aplicación se encuentra desplegada mediante **GitHub Pages**.

La configuración de Vite utiliza:

```ts
base: '/TaskFlow/'
```

para permitir que los archivos estáticos funcionen correctamente bajo la ruta del repositorio.

Demo:

https://aarodriguezperez.github.io/TaskFlow/

---

## Decisiones de diseño

### Separación de servicios

La lógica HTTP se encuentra en archivos `service` para evitar acoplarla directamente a los componentes visuales.

### Uso de hooks

Los hooks encapsulan lógica relacionada con:

- carga de información;
- formularios;
- loading;
- errores;
- actualización de datos.

### AuthContext

La autenticación se centraliza mediante Context para evitar administrar el token de forma independiente en cada componente.

### Página independiente por proyecto

Cada proyecto tiene una ruta dinámica:

```text
/projects/:projectId
```

Esto permite mantener separada la administración de proyectos y tareas y conservar el contexto del proyecto incluso al recargar la página.

### PUT y PATCH separados

`PUT` se utiliza para modificar los datos generales de una tarea.

`PATCH` se utiliza exclusivamente para cambiar su estado.

---

## Autor

**Alberto Alejandro Rodríguez Pérez**
