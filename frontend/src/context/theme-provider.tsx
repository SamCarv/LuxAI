import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext } from '../hooks/use-theme-context'

export const ThemeProvider = ({children}: {children: ReactNode}) => {
    const initialTheme = localStorage.getItem("theme") || "light"
    const [theme, setTheme] = useState<string>(initialTheme);
    
    const switchTheme = () => {
        setTheme(() => "dark" === theme? "light" : "dark")
    }

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    return (
        <ThemeContext value={{theme, switchTheme}}>
            {children}
        </ThemeContext>
    )
}