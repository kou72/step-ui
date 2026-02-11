import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('neu')
  const [dark,  setDark]  = useState(false)
  const toggleDark = () => setDark(d => !d)
  return (
    <ThemeContext.Provider value={{ theme, setTheme, dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
