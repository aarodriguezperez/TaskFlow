import LogoutIcon from '@mui/icons-material/Logout'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'

import { useAuth } from '../hooks/useAuth'
import { useProjectForm } from '../hooks/useProjectForm'
import { useProjects } from '../hooks/useProjects'
import { useTaskForm } from '../hooks/useTaskForm'
import { useTasks } from '../hooks/useTasks'

import type { Project } from '../types'

export function DashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const {
    projects,
    loading,
    error,
    refetch,
  } = useProjects()

  const projectForm = useProjectForm({
    onSuccess: refetch,
  })

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null)

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useTasks(selectedProject?.id ?? null)

  const taskForm = useTaskForm({
    projectId: selectedProject?.id ?? null,
    onSuccess: refetchTasks,
  })

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <Box maxWidth={640} mx="auto" mt={6}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Selecciona un proyecto para ver sus tareas o agregar una.
          </Typography>
        </Box>

        <Button
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Stack>

      {/* Crear proyecto */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <ProjectForm {...projectForm} />
      </Paper>

      {/* Lista de proyectos */}
      <Paper sx={{ p: 3 }}>
        <ProjectList
          projects={projects}
          loading={loading}
          error={error}
          selectedProjectId={selectedProject?.id ?? null}
          onSelectProject={setSelectedProject}
        />
      </Paper>

      {/* Sección de tareas */}
      {selectedProject && (
        <>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nueva tarea para {selectedProject.name}
            </Typography>

            <TaskForm {...taskForm} />
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tareas de {selectedProject.name}
            </Typography>

            <TaskList
              tasks={tasks}
              loading={tasksLoading}
              error={tasksError}
            />
          </Paper>
        </>
      )}
    </Box>
  )
}



// import LogoutIcon from '@mui/icons-material/Logout'
// import Box from '@mui/material/Box'
// import Button from '@mui/material/Button'
// import Paper from '@mui/material/Paper'
// import Stack from '@mui/material/Stack'
// import Typography from '@mui/material/Typography'
// import { useNavigate } from 'react-router-dom'
// import { ProjectForm } from '../components/ProjectForm'
// import { ProjectList } from '../components/ProjectList'
// import { useAuth } from '../hooks/useAuth'
// import { useProjectForm } from '../hooks/useProjectForm'
// import { useProjects } from '../hooks/useProjects'

// export function DashboardPage() {
//   const { logout } = useAuth()
//   const navigate = useNavigate()
//   const { projects, loading, error, refetch } = useProjects()
//   const projectForm = useProjectForm({ onSuccess: refetch })

//   function handleLogout() {
//     logout()
//     navigate('/login')
//   }

//   return (
//     <Box maxWidth={640} mx="auto" mt={6}>
//       <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
//         <Box>
//           <Typography variant="h4" gutterBottom>
//             Dashboard
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Fase 4 — formulario + lista conectados.
//           </Typography>
//         </Box>
//         <Button startIcon={<LogoutIcon />} onClick={handleLogout}>
//           Cerrar sesión
//         </Button>
//       </Stack>

//       <Paper sx={{ p: 3, mb: 3 }}>
//         <ProjectForm {...projectForm} />
//       </Paper>

//       <Paper sx={{ p: 3 }}>
//         <ProjectList projects={projects} loading={loading} error={error} />
//       </Paper>
//     </Box>
//   )
// }

