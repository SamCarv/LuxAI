import type { FC } from "react"
import { cn } from "../../lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variants: "standard" | "ghost" | "outline" | "circle"
  colors: "primary" | "secondary" | "no_color"
}

const Button: FC<ButtonProps> = ({variants, colors, className, children, ...props}) => {
  let variant = selectVariant(variants)
  let color = selectColor(colors)
  
  return (
    <button className={cn(`transition-colors cursor-pointer`, variant, color, className)} {...props}>
      {children}
    </button>
  )
}

function selectVariant(variant: "standard" | "ghost" | "outline" | "circle"){
  if (variant === "standard") {
    return "px-6 py-3 font-bold rounded-xl";
  };

  if (variant === "ghost") {
    return "flex flex-col items-center gap-2 group";
  };

  if (variant === "outline") {
    return "flex justify-center items-center rounded-sm"
  }

  if (variant === "circle") {
    return "p-2 rounded-full";
  };
};

function selectColor(color: "primary" | "secondary" |  "no_color") {
  if (color === "primary") {
    return "bg-yellow-400 hover:bg-yellow-500 text-black"
  }

  if (color === "secondary") {
    return "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-800"
  }

  if (color)

  if (color === "no_color") {
    return
  }
}

export default Button;