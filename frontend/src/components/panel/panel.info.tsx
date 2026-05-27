import React, { type FC } from 'react'
import { cn } from '../../lib/utils'

interface PanelItemInfoProps extends React.HTMLAttributes<HTMLDivElement> {}

const PanelItemInfo: FC<PanelItemInfoProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('flex flex-col justify-center items-start', className)} {...props}>
        {children}
    </div>
  )
}

const PanelItemInfoTitle: FC<PanelItemInfoProps> = ({ children, className, ...props }) => {
    return (
        <h3 className={cn('heading-xs group-hover:text-candy-corn-600 group-hover:text-lg dark:group-hover:text-candy-corn-400', className)} {...props}>
            {children}
        </h3>
    )
}

const PanelItemInfoDetail: FC<PanelItemInfoProps> = ({ children, className, ...props }) => {
    return (
        <p className={cn('body-xs text-smoke-400', className)} {...props}>
            {children}
        </p>
    )
}


export {PanelItemInfo, PanelItemInfoTitle, PanelItemInfoDetail}