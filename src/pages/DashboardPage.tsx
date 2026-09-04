import AddIcon from '@mui/icons-material/Add'
import LogoutIcon from '@mui/icons-material/Logout'

import Alert from '@mui/material/Alert'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import { useNavigate } from 'react-router-dom'

import { ProjectEditDialog } from '../components/ProjectEditDialog'
import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'

import { useAuth } from '../hooks/useAuth'
import { useProjectForm } from '../hooks/useProjectForm'
import { useProjects } from '../hooks/useProjects'

import { deleteProject } from '../services/projectService'

import type { Project } from '../types'

export function DashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  // =========================
  // PROJECTS
  // =========================

  const {
    projects,
    loading,
    error,
    refetch,
  } = useProjects()

  const [newProjectOpen, setNewProjectOpen] =
    useState(false)

  const [projectToEdit, setProjectToEdit] =
    useState<Project | null>(null)

  const [deletingProjectId, setDeletingProjectId] =
    useState<number | null>(null)

  const [deleteError, setDeleteError] =
    useState<string | null>(null)

  const projectForm = useProjectForm({
    onSuccess: () => {
      refetch()
      setNewProjectOpen(false)
    },
  })

  // =========================
  // GENERAL
  // =========================

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleOpenProject(project: Project) {
    navigate(`/projects/${project.id}`)
  }

  function handleEditProject(project: Project) {
    setProjectToEdit(project)
  }

  async function handleDeleteProject(project: Project) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar el proyecto "${project.name}"?`
    )

    if (!confirmed) {
      return
    }

    setDeletingProjectId(project.id)
    setDeleteError(null)

    try {
      await deleteProject(project.id)
      refetch()
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Error al eliminar el proyecto'
      )
    } finally {
      setDeletingProjectId(null)
    }
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
              Proyectos
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mt={0.5}
            >
              Selecciona un proyecto para administrar sus tareas.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              setNewProjectOpen(true)
            }
          >
            Nuevo proyecto
          </Button>
        </Stack>

        {deleteError && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {deleteError}
          </Alert>
        )}

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            bgcolor: 'background.paper',
          }}
        >
          <ProjectList
            projects={projects}
            loading={loading}
            error={error}
            deletingProjectId={deletingProjectId}
            onSelectProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            onEditProject={handleEditProject}
          />
        </Paper>
      </Box>

      {/* =========================
          NUEVO PROYECTO
      ========================== */}

      <Dialog
        open={newProjectOpen}
        onClose={() =>
          setNewProjectOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Nuevo proyecto
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <ProjectForm {...projectForm} />
        </DialogContent>
      </Dialog>

      {/* =========================
          EDITAR PROYECTO
      ========================== */}

      <ProjectEditDialog
        project={projectToEdit}
        open={projectToEdit !== null}
        onClose={() =>
          setProjectToEdit(null)
        }
        onSuccess={() => {
          refetch()
        }}
      />
    </>
  )
}