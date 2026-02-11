import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext('neu')

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('neu')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
