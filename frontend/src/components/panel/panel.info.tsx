import React, { type FC } from 'react'

interface PanelItemInfoProps extends React.HTMLAttributes<HTMLDivElement> {}

const PanelItemInfo: FC<PanelItemInfoProps> = ({ children, ...props }) => {
  return (
    <div className='flex flex-col justify-center' {...props}>
        {children}
    </div>
  )
}

const PanelItemInfoTitle: FC<PanelItemInfoProps> = ({ children, ...props }) => {
    return (
        <h3 className='heading-xs group-hover:text-candy-corn-600 group-hover:text-lg' {...props}>
            {children}
        </h3>
    )
}

const PanelItemInfoDetail: FC<PanelItemInfoProps> = ({ children, ...props }) => {
    return (
        <p className='body-xs text-smoke-400' {...props}>
            {children}
        </p>
    )
}


export {PanelItemInfo, PanelItemInfoTitle, PanelItemInfoDetail}