import type { FC } from "react"
import { cn } from "../../lib/utils"

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement>  {
  icon: React.ReactNode,
  label?: string,
}

const Button: FC<ButtonProps> = ({icon, label, onClick, className}) => {
  return (
    <button className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onClick}>
      <div className={cn(`p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm group-hover:text-paris-daisy-600 dark:group-hover:text-paris-daisy-400  transition-all border-2 border-gray-100 group-hover:border-yellow-400 dark:border-zinc-700 dark:group-hover:border-paris-daisy-400`, className)}>
        {icon}
      </div>
      {label && 
        <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">{label}</span>
      }
    </button>
  )
}

export default Button