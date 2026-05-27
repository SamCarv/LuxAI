import { type ReactNode } from "react"
import { useKeyboardShortcut, type Shortcut } from "../../hooks/use-keyboard-shortcut"

interface SectionProps {
    icon: ReactNode,
    title: string,
    shortcut: Shortcut,
    isActive: boolean,
    isCollapsed?: boolean,
    scope: string,
    onClick: () => void
}

const Section = ({ icon, title, shortcut, isActive, isCollapsed, scope, onClick }: SectionProps) => {
    useKeyboardShortcut(shortcut, () => onClick(), scope)

    return (
        <li className="w-full lg:w-auto">
            <button
                type='button'
                onClick={onClick}
                className={`
                    flex items-center w-full transition-all group cursor-pointer px-4 py-2 lg:p-0 rounded-sm lg:rounded-none
                    ${isCollapsed ? 'justify-center py-2' : 'h-12 lg:h-12 justify-between'}
                    ${isActive
                        ? 'bg-slate-200/60 dark:bg-zinc-800 lg:bg-slate-200'
                        : 'hover:bg-slate-200/50 dark:hover:bg-zinc-700/50'}
                    border-b-8 lg:border-b-0
                    ${isActive ? 'border-candy-corn-400' : 'border-transparent'}
                `}
            >
                <div className={`flex flex-row lg:flex-row items-center h-full ${isCollapsed ? 'md:flex-col gap-y-1 w-20' : 'gap-x-2 lg:gap-x-3 w-full'}`}>
                    <div className={`transition-all hidden lg:block
                        ${!isCollapsed && 'lg:w-3 lg:h-full'}
                        ${isActive
                            ? 'bg-candy-corn-400'
                            : 'bg-transparent group-hover:bg-slate-300 dark:group-hover:bg-zinc-700'}
                    `}/>

                    <div className={`flex items-center justify-center transition-colors
                        ${isCollapsed && isActive ? 'bg-candy-corn-200/60 dark:bg-candy-corn-400/20 p-2 rounded-xl' : ''}
                        ${isActive
                            ? 'text-candy-corn-600 dark:text-candy-corn-400'
                            : 'text-slate-500 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300'}
                    `}>
                        {icon}
                    </div>

                    <h2 className={`font-medium transition-all text-sm lg:body-md
                        ${isCollapsed ? 'leading-tight text-center body-sm' : ''}
                        ${isActive
                            ? 'text-candy-corn-700 dark:text-candy-corn-400'
                            : 'text-slate-600 dark:text-zinc-400 group-hover:dark:text-zinc-200'}
                    `}>
                        {title}
                    </h2>
                </div>

                {!isCollapsed && (
                    <kbd className='hidden lg:flex items-center justify-center border-slate-400 dark:border-zinc-700 text-slate-500 dark:text-zinc-500 border-2 rounded px-1.5 min-w-6 h-6 mr-4 text-[12px] font-bold group-hover:-translate-x-2 transition'>
                        {shortcut.key.toLocaleLowerCase()}
                    </kbd>
                )}
            </button>
        </li>
    )
}

export default Section