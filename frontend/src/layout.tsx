import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './components/side-bar'
import NavBar from './components/navbar'
import { useUserContext } from './hooks/use-user-context'
import { useEffect, useState } from 'react'
import { get_user_by_id } from './services/user'
import { jwtDecode } from 'jwt-decode'
import SideChat from './components/side-chat'
import { Toaster } from 'sonner'
import { useThemeContext } from './hooks/use-theme-context'


const Layout = () => {
    const { setUser } = useUserContext()
    const [isAssistentAIOpen, setIsAssistentAIOpen] = useState(true)
    const [isValidating, setIsValidating] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const token = localStorage.getItem("token")
    const {theme} = useThemeContext();

    useEffect(() => {
        const init = async () => {
            if (!token) {
                setIsAuthenticated(false)
                setIsValidating(false)
                return
            }

            try {
                const decodedJwt = jwtDecode(token)
                const id = decodedJwt.sub

                if (decodedJwt.exp && decodedJwt.exp * 1000 < Date.now()) {
                    console.log("Token expirado")
                    localStorage.removeItem("token")
                    setIsAuthenticated(false)
                    setIsValidating(false)
                    return
                }

                if (!id) {
                    console.log("Not get user_id")
                    setIsAuthenticated(false)
                    setIsValidating(false)
                    return
                }

                const response = await get_user_by_id(id)

                if (response.status !== 200) {
                    console.log("Not get user", response.data?.message)
                    localStorage.removeItem("token")
                    setIsAuthenticated(false)
                } else {
                    setUser(response.data)
                    setIsAuthenticated(true)
                }
            } catch (error) {
                console.error("Erro ao validar token:", error)
                setIsAuthenticated(false)
            } finally {
                setIsValidating(false)
            }
        }

        init()
    }, [token, setUser])

    if (isValidating) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <p className="text-lg font-semibold animate-pulse">Carregando...</p> 
            </div>
        )
    }

    return isAuthenticated ? (
        <div className="flex w-full h-screen overflow-hidden">    
            <aside className="h-full shrink-0">
                <Sidebar />
            </aside>

            <div className="flex flex-col flex-1 h-full overflow-y-auto">
                <header className="flex justify-end items-center shrink-0">
                    <NavBar toggleSideChat={() => setIsAssistentAIOpen(!isAssistentAIOpen)}/>
                </header>
                <main className="flex flex-1 p-10 justify-center">
                    <Outlet />
                </main>
            </div>

            <aside className="flex items-start h-full shrink-0">
                {isAssistentAIOpen && (
                    <SideChat toggleSideChat={() => setIsAssistentAIOpen(!isAssistentAIOpen)}/>
                )}
            </aside>

            <Toaster richColors position='top-center' theme={theme} />
        </div>
    ): <Navigate to={'/login'} replace />
}

export default Layout