import React, { type FC } from 'react'
import { cn } from '../../lib/utils'
import { getColor, getIcon, type TransactionType } from './constants'



interface AmountProps extends React.HTMLAttributes<HTMLDivElement>{
  transactionType?: TransactionType 
} 

const Amount: FC<AmountProps> = ({ children, className, transactionType, ...props }) => {
  const color = getColor(transactionType)
  const Icon = getIcon(transactionType)
  
  return (
    <div className={cn(`flex items-center`, color, className)} {...props}>
        {Icon && (<Icon size={20} strokeWidth={1.5}/>)}
        {children}
    </div>
  )
}

export default Amount