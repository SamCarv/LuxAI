import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeProps {
  theme: Theme,
  switchTheme: ()=>void,
}

export const ThemeContext = createContext<ThemeProps | undefined>(undefined)

export const useThemeContext = () => {
  const theme = useContext(ThemeContext)

  if(!theme) {
    throw new Error(`Theme variable can't be null or undefined`)
  }

  return theme
}