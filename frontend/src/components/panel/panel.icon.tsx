import React, { type FC } from 'react'
import { cn } from '../../lib/utils'

interface PanelItemIconProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

const PanelItemIcon: FC<PanelItemIconProps> = ({className, children, ...props}) => {
  return (
    <div className={cn(`flex justify-center items-center bg-smoke-200 rounded-md p-1.5 mr-4 group-hover:bg-neutral-50`, className)}  {...props}>
        {children}
    </div>
  )
}

export default PanelItemIcon