import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'

import { updateProject } from '../services/projectService'
import type { Project } from '../types'

interface ProjectEditDialogProps {
  project: Project | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ProjectEditDialog({
  project,
  open,
  onClose,
  onSuccess,
}: ProjectEditDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (project) {
      setName(project.name)
      setDescription(project.description ?? '')
      setError(null)
    }
  }, [project])

  const valid = name.trim().length >= 3

  async function handleSave() {
    if (!project || !valid || submitting) {
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await updateProject(project.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      })

      onSuccess()
      onClose()
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al actualizar el proyecto'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Editar proyecto</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
          helperText="Mínimo 3 caracteres"
        />

        <TextField
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={submitting}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!valid || submitting}
        >
          {submitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}