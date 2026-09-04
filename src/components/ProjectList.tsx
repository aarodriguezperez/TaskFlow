import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import type { Project } from '../types'

interface ProjectListProps {
  projects: Project[]
  loading: boolean
  error: string | null
  deletingProjectId: number | null
  onSelectProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
  onEditProject: (project: Project) => void
}

export function ProjectList({
  projects,
  loading,
  error,
  deletingProjectId,
  onSelectProject,
  onDeleteProject,
  onEditProject,
}: ProjectListProps) {
  if (loading) {
    return (
      <Stack alignItems="center" py={5}>
        <CircularProgress />
      </Stack>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (projects.length === 0) {
    return (
      <Typography color="text.secondary">
        No hay proyectos disponibles.
      </Typography>
    )
  }

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Chip
          label={`${projects.length} proyectos`}
          size="small"
          variant="outlined"
        />
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {projects.map((project) => {
          return (
            <Card
              key={project.id}
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',

                bgcolor: 'background.paper',
                borderColor: 'divider',
                borderWidth: 1,

                transition:
                  'border-color 0.2s, transform 0.2s, background-color 0.2s',

                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardActionArea
                onClick={() =>
                  onSelectProject(project)
                }
                sx={{
                  flexGrow: 1,
                  alignItems: 'stretch',
                }}
              >
                <CardContent
                  sx={{
                    minHeight: 130,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                    >
                      {project.name}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {project.description ||
                      'Sin descripción'}
                  </Typography>
                </CardContent>
              </CardActionArea>

              <CardActions
                sx={{
                  px: 2,
                  pb: 1.5,
                  pt: 0.5,
                  justifyContent: 'space-between',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  ID {project.id}
                </Typography>

                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Editar proyecto">
                    <IconButton
                      size="small"
                      onClick={() =>
                        onEditProject(project)
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Eliminar proyecto">
                    <IconButton
                      size="small"
                      color="error"
                      disabled={
                        deletingProjectId === project.id
                      }
                      onClick={() =>
                        onDeleteProject(project)
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardActions>
            </Card>
          )
        })}
      </Box>
    </>
  )
}