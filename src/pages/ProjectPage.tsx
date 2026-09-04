import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LogoutIcon from '@mui/icons-material/Logout'

import Alert from '@mui/material/Alert'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { useState } from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { TaskEditDialog } from '../components/TaskEditDialog'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'

import { useAuth } from '../hooks/useAuth'
import { useProject } from '../hooks/useProject'
import { useTaskForm } from '../hooks/useTaskForm'
import { useTasks } from '../hooks/useTasks'

import {
  deleteTask,
  updateTaskStatus,
} from '../services/taskService'

import type {
  Task,
  TaskStatus,
} from '../types'

export function ProjectPage() {
  const { projectId: projectIdParam } = useParams()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const parsedProjectId = Number(projectIdParam)

  const projectId =
    Number.isInteger(parsedProjectId) &&
    parsedProjectId > 0
      ? parsedProjectId
      : null

  // =========================
  // PROJECT
  // =========================

  const {
    project,
    loading: projectLoading,
    error: projectError,
  } = useProject(projectId)

  // =========================
  // TASKS
  // =========================

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useTasks(projectId)

  const [newTaskOpen, setNewTaskOpen] =
    useState(false)

  const [taskToEdit, setTaskToEdit] =
    useState<Task | null>(null)

  const [deletingTaskId, setDeletingTaskId] =
    useState<number | null>(null)

  const [deleteTaskError, setDeleteTaskError] =
    useState<string | null>(null)

  const [
    updatingStatusTaskId,
    setUpdatingStatusTaskId,
  ] = useState<number | null>(null)

  const [statusError, setStatusError] =
    useState<string | null>(null)

  const taskForm = useTaskForm({
    projectId,
    onSuccess: () => {
      refetchTasks()
      setNewTaskOpen(false)
    },
  })

  // =========================
  // GENERAL
  // =========================

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleBack() {
    navigate('/dashboard')
  }

  // =========================
  // TASK ACTIONS
  // =========================

  function handleEditTask(task: Task) {
    setTaskToEdit(task)
  }

  async function handleDeleteTask(task: Task) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar la tarea "${task.title}"?`
    )

    if (!confirmed) {
      return
    }

    setDeletingTaskId(task.id)
    setDeleteTaskError(null)

    try {
      await deleteTask(task.id)
      refetchTasks()
    } catch (err: unknown) {
      setDeleteTaskError(
        err instanceof Error
          ? err.message
          : 'Error al eliminar la tarea'
      )
    } finally {
      setDeletingTaskId(null)
    }
  }

  async function handleChangeTaskStatus(
    task: Task,
    status: TaskStatus
  ) {
    setUpdatingStatusTaskId(task.id)
    setStatusError(null)

    try {
      await updateTaskStatus(task.id, status)
      refetchTasks()
    } catch (err: unknown) {
      setStatusError(
        err instanceof Error
          ? err.message
          : 'Error al actualizar el estado'
      )
    } finally {
      setUpdatingStatusTaskId(null)
    }
  }

  // =========================
  // ID INVÁLIDO
  // =========================

  if (projectId === null) {
    return (
      <Box maxWidth={900} mx="auto" p={4}>
        <Alert severity="error">
          El ID del proyecto no es válido.
        </Alert>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Volver a proyectos
        </Button>
      </Box>
    )
  }

  return (
    <>
      {/* =========================
          NAVBAR
      ========================== */}

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: '#1C222B',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            maxWidth: 1100,
            width: '100%',
            mx: 'auto',
            minHeight: 52,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              flexGrow: 1,
              letterSpacing: 0.4,
            }}
          >
            TaskFlow
          </Typography>

          <Tooltip title="Cerrar sesión">
            <IconButton
              color="inherit"
              size="small"
              onClick={handleLogout}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* =========================
          CONTENIDO
      ========================== */}

      <Box
        maxWidth={1000}
        mx="auto"
        px={3}
        py={5}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 4 }}
        >
          Volver a proyectos
        </Button>

        {/* Cargando proyecto */}
        {projectLoading && (
          <Stack alignItems="center" py={6}>
            <CircularProgress />
          </Stack>
        )}

        {/* Error proyecto */}
        {projectError && (
          <Alert severity="error">
            {projectError}
          </Alert>
        )}

        {/* Proyecto encontrado */}
        {project && (
          <>
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              justifyContent="space-between"
              alignItems={{
                xs: 'flex-start',
                sm: 'center',
              }}
              spacing={2}
              mb={4}
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={600}
                >
                  {project.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={0.5}
                >
                  {project.description ||
                    'Sin descripción'}
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() =>
                  setNewTaskOpen(true)
                }
              >
                Nueva tarea
              </Button>
            </Stack>

            {/* Errores de acciones */}
            {deleteTaskError && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
              >
                {deleteTaskError}
              </Alert>
            )}

            {statusError && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
              >
                {statusError}
              </Alert>
            )}

            {/* Lista de tareas */}
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                bgcolor: 'background.paper',
              }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    Tareas
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Tareas registradas en este proyecto: {tasks.length}
                  </Typography>
                </Box>

                <TaskList
                  tasks={tasks}
                  loading={tasksLoading}
                  error={tasksError}
                  deletingTaskId={
                    deletingTaskId
                  }
                  updatingStatusTaskId={
                    updatingStatusTaskId
                  }
                  onDeleteTask={
                    handleDeleteTask
                  }
                  onEditTask={
                    handleEditTask
                  }
                  onChangeStatus={
                    handleChangeTaskStatus
                  }
                />
              </Stack>
            </Paper>
          </>
        )}
      </Box>

      {/* =========================
          NUEVA TAREA
      ========================== */}

      <Dialog
        open={newTaskOpen}
        onClose={() =>
          setNewTaskOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Nueva tarea
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <TaskForm {...taskForm} />
        </DialogContent>
      </Dialog>

      {/* =========================
          EDITAR TAREA
      ========================== */}

      <TaskEditDialog
        task={taskToEdit}
        open={taskToEdit !== null}
        onClose={() =>
          setTaskToEdit(null)
        }
        onSuccess={() => {
          refetchTasks()
        }}
      />
    </>
  )
}