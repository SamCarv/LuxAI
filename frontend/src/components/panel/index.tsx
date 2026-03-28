import React, { type FC } from 'react'
import { cn } from '../../lib/utils'

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

const Panel: FC<PanelProps> = ({ className, ...props }) => {
  return (
    <div className={cn(`flex flex-col bg-smoke-100 w-full px-7 py-5 shadow-2xl rounded-xl gap-y-4`, className)} {...props} >
        
    </div>
  )
}

export default Panel