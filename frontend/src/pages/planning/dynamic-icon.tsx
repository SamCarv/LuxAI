import type { FC } from "react"
import { iconMap } from "../../utils/constants.planning"
import { cn } from "../../lib/utils"

export type IconName = keyof typeof iconMap
interface DynamicIconProps extends React.HTMLAttributes<SVGSVGElement> {
  name: IconName
  size?: number
}

export const DynamicIcon: FC<DynamicIconProps> = ({ name, size, className, ...props }) => {
  const Icon = iconMap[name]
  return <Icon className={cn(className)} size={size || 32} {...props} />
}