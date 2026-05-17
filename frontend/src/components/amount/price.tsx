import type { FC } from "react"
import { cn } from "../../lib/utils"

interface Amount extends React.HTMLAttributes<HTMLParagraphElement> {}

const AmountValue: FC<Amount> = ({children, className, ...props}) => {
    return (
        <p className={cn(`heading-sm`, className)} {...props}>
            {children}
        </p>
    )
}

const AmountCurrency: FC<Amount> = ({children, className, ...props}) => {
    return (
        <p className={cn('body-xs self-baseline pt-1 pr-0.5', className)} {...props}>
            {children}
        </p>
    )
}

export { AmountCurrency, AmountValue }