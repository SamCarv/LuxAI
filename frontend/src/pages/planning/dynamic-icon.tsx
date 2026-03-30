import { iconMap } from "../../utils/constants.planning"

export type IconName = keyof typeof iconMap

export const DynamicIcon = ({ name }: { name: IconName }) => {
  const Icon = iconMap[name]
  return <Icon className='group-hover:stroke-candy-corn-500/80' size={32} />
}