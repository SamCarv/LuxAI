import React, { type FC } from 'react'
import { cn } from '../../lib/utils'

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const Panel: FC<PanelProps> = ({ className, children, ...props }) => {
  return (
    <section className={cn(`flex flex-col bg-smoke-100 border dark:bg-zinc-800 dark:border-zinc-700 w-full px-7 py-5 shadow-2xl rounded-xl gap-y-4`, className)} {...props} >
        {children}
    </section>
  )
}

export default Panel