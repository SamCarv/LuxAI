import type { FC } from 'react'
import { cn } from '../../lib/utils'

interface IconButtonProps extends React.HTMLAttributes<HTMLDivElement> {
}

const ButtonIcon: FC<IconButtonProps> = ({children, className, ...props}) => {
  return (
    <div className={cn(
            `p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm group-hover:text-paris-daisy-600 
            dark:group-hover:text-paris-daisy-400  transition-all border-2 border-gray-100 group-hover:border-yellow-400
            dark:border-zinc-700 dark:group-hover:border-paris-daisy-400`, 
            className
        )} 
        {...props}
    >
        {children}
    </div>
  )
}

export default ButtonIcon