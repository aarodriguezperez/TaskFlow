import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import type { Task } from '../types'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  error: string | null
}

export function TaskList({
  tasks,
  loading,
  error,
}: TaskListProps) {
  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
      </Stack>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (tasks.length === 0) {
    return (
      <Typography color="text.secondary">
        No hay tareas para este proyecto.
      </Typography>
    )
  }

  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Tareas ({tasks.length})
      </Typography>

      <List>
        {tasks.map((task, index) => (
          <div key={task.id}>
            <ListItem
              alignItems="flex-start"
              sx={{ px: 0, py: 2 }}
            >
              <ListItemText
                primary={
                  <Typography fontWeight={600}>
                    {task.title}
                  </Typography>
                }
                secondary={
                  <Stack spacing={1} mt={1}>
                    {task.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {task.description}
                      </Typography>
                    )}

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                    >
                      <Chip
                        label={`Estado: ${task.status}`}
                        size="small"
                        variant="outlined"
                      />

                      <Chip
                        label={`Prioridad: ${task.priority}`}
                        size="small"
                      />

                      {task.dueDate && (
                        <Chip
                          label={`Fecha: ${task.dueDate}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </Stack>
                }
              />
            </ListItem>

            {index < tasks.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </>
  )
}