// layout.tsx
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar'
import NavBar from './components/navbar'

const Layout = () => {
  return (
    <div className="flex w-full h-screen">
        <aside className="bg-gray-100">
            <Sidebar />
        </aside>
        <div className="flex flex-col flex-1">
            <header className="bg-gray-200 flex justify-end items-center">
                <NavBar />
            </header>
            <main className="flex-1 bg-gray-50 p-4">
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default Layout