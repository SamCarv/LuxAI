import type { FC } from "react";
import { cn } from "../../lib/utils";
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  role: "user" | "assistant";
  children: string
}

const ChatMessageText: FC<ChatMessageProps> = ({ role, className, children, ...props }) => {
  const alignment = selectAlignment(role);
  const bubbleStyle = selectBubbleStyle(role);

  return (
    <div className={cn("flex flex-col w-full", alignment, className)} {...props}>
      <span className="text-xs text-slate-400 dark:text-zinc-500 mb-1 px-1 capitalize">
        {role === "user" ? "Você" : "Lux - AI"}
      </span>
      <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap wrap-break-words shadow-sm", bubbleStyle)}>
        <ReactMarkdown>{children}</ReactMarkdown>
      </div>
    </div>
  );
};

function selectAlignment(role: "user" | "assistant") {
  return role === "user" ? "items-end" : "items-start";
}

function selectBubbleStyle(role: "user" | "assistant") {
  if (role === "user") {
    return "bg-yellow-400 text-black font-medium rounded-tr-none";
  }
  return "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-tl-none";
}

export default ChatMessageText;