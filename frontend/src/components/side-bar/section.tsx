import { type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useKeyboardShortcut, type Shortcut } from '../../hooks/use-keyboard-shortcut'
import { ArrowRight } from 'lucide-react'

interface SectionSideBarProps {
    icon: ReactNode,
    title: string,
    shortcut: Shortcut,
    to: string,
    isActive: boolean,
    isCollapsed?: boolean,
}

const SectionSideBar = ({ icon, title, shortcut, to, isActive, isCollapsed }: SectionSideBarProps) => {
  const navigate = useNavigate()
  useKeyboardShortcut(shortcut, () => navigate(`/${to}`))

  return (
    <li>
      <NavLink to={to} 
        className={`
          flex items-center w-full transition-all group cursor-pointer
          ${isCollapsed ? 'justify-center py-2' : 'h-12 justify-between'}
          ${isActive 
            ? 'bg-slate-200 dark:bg-zinc-800' 
            : 'hover:bg-slate-200/50 dark:hover:bg-zinc-700/50'}
        `}
      >
        <div className={`flex items-center h-full ${isCollapsed ? 'flex-col gap-y-1 w-20' : 'gap-x-3 w-full'}`}>
          <div className={`transition-all
              ${!isCollapsed && 'w-3 h-full'}
              ${isActive 
                ? 'bg-candy-corn-400' 
                : 'bg-transparent group-hover:bg-slate-300 dark:group-hover:bg-zinc-700'}
          `}></div>
          <div className={`flex items-center justify-center transition-colors
            ${isCollapsed && isActive ? 'bg-candy-corn-200/60 dark:bg-candy-corn-400/20 p-2 rounded-xl' : ''}
            ${isActive 
                ? 'text-candy-corn-600 dark:text-candy-corn-400' 
                : 'text-slate-500 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300'}
          `}>
            {icon}
          </div>
          <h2 className={`font-medium transition-all
            ${isCollapsed ? 'leading-tight text-center body-sm' : 'body-md'}
            ${isActive 
                ? 'text-candy-corn-700 dark:text-candy-corn-400' 
                : 'text-slate-600 dark:text-zinc-400 group-hover:dark:text-zinc-200'}
          `}>
            {title}
          </h2>
        </div>

        {!isCollapsed && (
          <>
            <kbd className={`hidden lg:flex items-center justify-center border-slate-400 dark:border-zinc-700 text-slate-500 dark:text-zinc-500 border-2 rounded px-1.5 min-w-6 h-6 mr-4 text-[12px] font-bold transition
                ${!isActive && 'group-hover:-translate-x-2'}
              `}
            >
              {shortcut.key.toLocaleLowerCase()}
            </kbd>
            <ArrowRight className={`flex lg:hidden text-slate-400 dark:text-zinc-600 px-1.5 mr-4
                ${!isActive && 'group-hover:-translate-x-2'}
              `} 
              size={36} />
          </>
        )}
      </NavLink>
    </li>
  )
}

export default SectionSideBar