import type { FC } from "react"
import { cn } from "../../lib/utils"

interface ButtonLabelProps extends React.HTMLAttributes<HTMLSpanElement> {} 

const ButtonLabel: FC<ButtonLabelProps> = ({className, children, ...props}) => {
  return (
    <span className={cn(`text-xs font-medium text-gray-500 dark:text-zinc-400`, className)} {...props}>
        {children}
    </span>
  )
}

export default ButtonLabel