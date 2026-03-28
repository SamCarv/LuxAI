import { useState, type ReactNode } from 'react'
import { ThemeContext } from '../hooks/use-theme-context'

export const ThemeProvider = ({children}: {children: ReactNode}) => {
    const [theme, setTheme] = useState<string>('light');
    
    const switchTheme = () => {
        setTheme(() => "dark" === theme?"light":"dark")
    }

    return (
        <ThemeContext value={{theme, switchTheme}}>
            {children}
        </ThemeContext>
    )
}