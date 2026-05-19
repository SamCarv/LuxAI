import { createContext, useContext } from 'react'

interface ThemeProps {
  theme: string,
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