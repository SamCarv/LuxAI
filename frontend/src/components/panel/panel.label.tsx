import React, { type FC } from 'react'
import { cn } from '../../lib/utils'

interface PanelLabelProps extends React.HTMLAttributes<HTMLHeadingElement> {

}

const PanelLabel: FC<PanelLabelProps> = ({className, children, ...props}) => {
  return (
    <h2 className={cn(`flex heading-md`, className)} {...props}>
        {children}
    </h2>
  )
}

export default PanelLabel