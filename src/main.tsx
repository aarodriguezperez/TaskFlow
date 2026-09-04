import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import App from './App.tsx'

const theme = createTheme({
  palette: {
    mode: 'dark',

    background: {
      default: '#242A33',
      paper: '#2B323D',
    },

    primary: {
      main: '#5CC8FF',
    },

    secondary: {
      main: '#8AB4F8',
    },

    text: {
      primary: '#E6EDF3',
      secondary: '#AAB4C0',
    },

    divider: '#3A4350',

    error: {
      main: '#FF6B6B',
    },

    warning: {
      main: '#F6C344',
    },

    success: {
      main: '#63D297',
    },
  },

  shape: {
    borderRadius: 8,
  },

  typography: {
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)