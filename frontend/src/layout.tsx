import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar'
import NavBar from './components/navbar'
import { useUserContext } from './hooks/use-user-context'
import { useEffect } from 'react'
import { get_user_by_id } from './services/user'
import { jwtDecode } from 'jwt-decode'

const Layout = () => {
    const { setUser } = useUserContext()

    useEffect(() => {
        const init = async() => {
            const token = localStorage.getItem("token")
            
            if(!token) {
                console.log("Not get token")
                return
            }

            const decodedJwt = jwtDecode(token)
            const id = decodedJwt.sub

            if(!id) {
                console.log("Not get user_id")
                return
            }

            const response = await get_user_by_id(id)

            if(response.status !== 200) {
                console.log("Not get user")
                console.log(response.data.message)
                return
            }

            setUser(response.data)
        }
        init()
    }, [])

    return (
        <div className="flex w-full h-full">
            <aside>
                <Sidebar />
            </aside>
            <div className="flex flex-col flex-1">
                <header className="flex justify-end items-center">
                    <NavBar />
                </header>
                <main className="flex flex-1 px-12 py-10 justify-center">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout