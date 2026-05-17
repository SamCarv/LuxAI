import React, { type FC } from 'react'
import { cn } from '../../lib/utils'

interface PanelItemProps extends React.HTMLAttributes<HTMLLIElement> {

}

const PanelItem: FC<PanelItemProps> = ({ children, className, ...props }) => {
  return (
    <li className={cn(`flex h-min bg-smoke-50 ring-2 ring-smoke-300 hover:ring-candy-corn-600 dark:ring-zinc-600 dark:hover:ring-candy-corn-300 rounded-sm p-3 cursor-pointer hover:bg-slate-200/95 dark:bg-zinc-900 dark:inset-ring-zinc-900 hover:shadow-md dark:hover:bg-zinc-800 transition-all group duration-200`, className)} {...props}>
      {children}
    </li>
  )
}

export default PanelItem