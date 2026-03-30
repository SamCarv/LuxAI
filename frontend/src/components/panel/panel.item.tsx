import React, { type FC } from 'react'
import { cn } from '../../lib/utils'

interface PanelItemProps extends React.HTMLAttributes<HTMLLIElement> {

}

const PanelItem: FC<PanelItemProps> = ({ children, className, ...props }) => {
  return (
    <li className={cn(`flex h-min bg-smoke-50 ring-1 ring-smoke-300 rounded-sm p-3 cursor-pointer hover:bg-slate-200/95 group`, className)} {...props}>
      {children}
    </li>
  )
}

export default PanelItem