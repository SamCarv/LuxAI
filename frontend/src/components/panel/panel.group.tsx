import React, { type FC } from 'react'
import { cn } from '../../lib/utils'

interface PanelGroupProps extends React.HTMLAttributes<HTMLUListElement>{}

const PanelGroup: FC<PanelGroupProps> = ({children, className, ...props}) => {
  return (
    <ul className={cn(`flex flex-col`, className)} {...props}>
        {children}
    </ul>
  )
}

export default PanelGroup