import type { FC, LabelHTMLAttributes } from "react"

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label: FC<LabelProps>  = ({className, children, ...props}) => {
  return (
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" {...props}>
        {children}
    </label>
  )
}

export default Label