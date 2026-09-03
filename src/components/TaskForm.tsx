import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'

import type { TaskPriority } from '../types'

interface TaskFormProps {
  title: string
  setTitle: (value: string) => void
  description: string
  setDescription: (value: string) => void
  priority: TaskPriority
  setPriority: (value: TaskPriority) => void
  dueDate: string
  setDueDate: (value: string) => void
  submitting: boolean
  error: string | null
  valid: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function TaskForm({
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  submitting,
  error,
  valid,
  handleSubmit,
}: TaskFormProps) {
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>

        <TextField
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nombre de la tarea"
          fullWidth
          required
        />

        <TextField
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción de la tarea"
          multiline
          rows={3}
          fullWidth
        />

        <TextField
          select
          label="Prioridad"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as TaskPriority)
          }
          fullWidth
        >
          <MenuItem value="LOW">Baja</MenuItem>
          <MenuItem value="MED">Media</MenuItem>
          <MenuItem value="HIGH">Alta</MenuItem>
        </TextField>

        <TextField
          label="Fecha límite"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={!valid || submitting}
        >
          {submitting ? 'Creando...' : 'Crear tarea'}
        </Button>
      </Stack>
    </form>
  )
}