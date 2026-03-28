// layout.tsx
import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar'
import NavBar from './components/navbar'

const Layout = () => {
  return (
    <div className="flex w-full h-full">
        <aside className="bg-gray-100">
            <Sidebar />
        </aside>
        <div className="flex flex-col flex-1">
            <header className="flex justify-end items-center">
                <NavBar />
            </header>
            <main className="flex flex-1 p-12 justify-center">
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default Layout