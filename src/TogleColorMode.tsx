import { createTheme, ThemeProvider } from '@mui/material'
import React from 'react'
import App from './App'
import { getDesignTokens } from './theme'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { useLocalStorage } from './utils/useLocalStorage'

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} })

const ToggleColorMode = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    const currentColorMode = window.localStorage.getItem('colorMode')
    if (currentColorMode) {
      setMode(currentColorMode as 'light' | 'dark')
    }
  }, [])

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const currentMode = prevMode === 'light' ? 'dark' : 'light'
          window.localStorage.setItem('colorMode', currentMode)
          return currentMode
        })
      },
    }),
    [],
  )

  const darkModeTheme = createTheme(getDesignTokens(mode))

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={darkModeTheme}>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default ToggleColorMode
