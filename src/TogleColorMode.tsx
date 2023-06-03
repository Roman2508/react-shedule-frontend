import { createTheme, ThemeProvider } from '@mui/material'
import React from 'react'
import App from './App'
import { getDesignTokens } from './theme'
import { Provider } from 'react-redux'
import { store } from './redux/store'

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} })

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light')

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
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
