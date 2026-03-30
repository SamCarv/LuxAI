import { type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useKeyboardShortcut, type Shortcut } from '../../hooks/use-keyboard-shortcut'

interface SectionSideBarProps {
    icon: ReactNode,
    title: string,
    shortcut: Shortcut,
    isActive: boolean
    to: string,
}

const SectionSideBar = ({icon, title, shortcut, isActive, to}: SectionSideBarProps) => {
  const navigate = useNavigate()
  useKeyboardShortcut(shortcut, ()=>navigate(`/${to}`))

  return (
      <li>
        <NavLink to={to} className={`flex items-center justify-between w-full h-13 hover:cursor-pointer hover:bg-slate-300 hover:animate-pulse
          ${isActive ? 'bg-slate-200' : ''}
      ` }>
          <div className='flex items-center gap-x-2 w-full h-full'>
            <div className={`w-4 h-13
                ${isActive ? 'bg-candy-corn-400' : 'hover:animate-pulse hover:bg-gold-400'}
                `}></div>
            {icon}
            <h2 className='body-md'>{title}</h2>
          </div>
          <p className='flex items-center justify-center border-slate-400 text-slate-500 border-2 rounded-sm w-6 h-6 mr-4'>{shortcut.key}</p>
        </NavLink>
      </li>
  )
}

export default SectionSideBar