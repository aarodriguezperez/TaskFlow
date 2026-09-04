import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'

import { updateTask } from '../services/taskService'
import type { Task, TaskPriority } from '../types'

interface TaskEditDialogProps {
    task: Task | null
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export function TaskEditDialog({
    task,
    open,
    onClose,
    onSuccess,
}: TaskEditDialogProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('MED')
    const [dueDate, setDueDate] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [assigneeId, setAssigneeId] = useState<number | null>(null)

    useEffect(() => {
        if (task) {
            setTitle(task.title)
            setDescription(task.description ?? '')
            setPriority(task.priority)
            setDueDate(task.dueDate ?? '')
            setAssigneeId(task.assigneeId)
            setError(null)
        }
    }, [task])

    const valid = title.trim().length > 0

    async function handleSave() {
        if (!task || !valid || submitting) {
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            await updateTask(task.id, {
                title: title.trim(),
                description: description.trim() || null,
                priority,
                assigneeId,
                dueDate: dueDate || null,
            })

            onSuccess()
            onClose()
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Error al actualizar la tarea'
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
            <DialogTitle>Editar tarea</DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
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

                <TextField
                    select
                    label="Prioridad"
                    value={priority}
                    onChange={(e) =>
                        setPriority(e.target.value as TaskPriority)
                    }
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="LOW">Baja</MenuItem>
                    <MenuItem value="MED">Media</MenuItem>
                    <MenuItem value="HIGH">Alta</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Responsable"
                    value={assigneeId ?? ''}
                    onChange={(e) =>
                        setAssigneeId(
                            e.target.value === ''
                                ? null
                                : Number(e.target.value)
                        )
                    }
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="">
                        Sin responsable
                    </MenuItem>

                    <MenuItem value={1}>
                        Ana
                    </MenuItem>

                    <MenuItem value={2}>
                        Luis
                    </MenuItem>

                    <MenuItem value={3}>
                        Admin
                    </MenuItem>
                </TextField>

                <TextField
                    label="Fecha límite"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
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