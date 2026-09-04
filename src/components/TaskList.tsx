import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

import type { Task, TaskStatus } from '../types'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  deletingTaskId: number | null
  onDeleteTask: (task: Task) => void
  onEditTask: (task: Task) => void
  updatingStatusTaskId: number | null
  onChangeStatus: (task: Task, status: TaskStatus) => void
}

function getAssigneeName(assigneeId: number | null) {
  switch (assigneeId) {
    case 1:
      return 'Ana'
    case 2:
      return 'Luis'
    case 3:
      return 'Admin'
    default:
      return 'Sin responsable'
  }
}

export function TaskList({
  tasks,
  loading,
  error,
  deletingTaskId,
  onDeleteTask,
  onEditTask,
  updatingStatusTaskId,
  onChangeStatus,
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
      <List>
        {tasks.map((task, index) => (
          <div key={task.id}>
            <ListItem
              alignItems="flex-start"
              sx={{ px: 0, py: 2 }}
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Editar tarea">
                    <IconButton
                      edge="end"
                      onClick={() => onEditTask(task)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Eliminar tarea">
                    <IconButton
                      edge="end"
                      color="error"
                      disabled={deletingTaskId === task.id}
                      onClick={() => onDeleteTask(task)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
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

                      <Chip
                        label={`Responsable: ${getAssigneeName(task.assigneeId)}`}
                        size="small"
                        variant="outlined"
                      />

                      {task.dueDate && (
                        <Chip
                          label={`Fecha: ${task.dueDate}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      <TextField
                        select
                        size="small"
                        label="Estado"
                        value={task.status}
                        disabled={updatingStatusTaskId === task.id}
                        onChange={(e) =>
                          onChangeStatus(
                            task,
                            e.target.value as TaskStatus
                          )
                        }
                        sx={{ minWidth: 160 }}
                      >
                        <MenuItem value="TODO">
                          Por hacer
                        </MenuItem>

                        <MenuItem value="IN_PROGRESS">
                          En progreso
                        </MenuItem>

                        <MenuItem
                          value="DONE"
                          disabled={task.assigneeId === null}
                        >
                          {task.assigneeId === null
                            ? 'Completada (requiere responsable)'
                            : 'Completada'}
                        </MenuItem>
                      </TextField>
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