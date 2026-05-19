import type { FC } from "react"
import { cn } from "../../lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: FC<InputProps> = ({className, ...props}) => {
    return (
        <input className={cn(`w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl placeholder:text-zinc-400 dark:text-white outline-none text-sm focus:ring-2 focus:ring-candy-corn-400`, className)} {...props}/>
    )
}

export default Input