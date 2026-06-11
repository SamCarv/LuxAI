import { useState, useRef, useEffect } from "react";
import type { FC, HTMLAttributes } from "react";
import { X, Paperclip, Bot, Mic, SendHorizontal, Sparkles } from "lucide-react";
import Button from "../../components/button/index";
import ChatMessageText from "../chat-message/index";
import { cn } from "../../lib/utils";
import type { ChatAttachment, ChatMessage, ChatRequest } from "../../types/chat";
import { chat } from "../../services/chat";

interface SideChatProps extends HTMLAttributes<HTMLDivElement> {
    toggleSideChat: () => void
}

const models = ["Gemini", "ollama"];

const SideChat: FC<SideChatProps> = ({ toggleSideChat }) => {
  const [message, setMessage] = useState("");
  const [modelIndex, setModelIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [message]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isGenerating]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isGenerating) return;

    const userText = message;
    const currentAttachments = [...attachments];

    const newUserMessage: ChatMessage = {
      role: "user",
      content: userText,
    };

    setChatHistory((prev) => [...prev, newUserMessage]);
    setMessage("");
    setAttachments([]);
    setIsGenerating(true);

    try {
      const formattedHistory: ChatMessage[] = chatHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const requestPayload: ChatRequest = {
        message: userText,
        history: formattedHistory,
        attachments: currentAttachments,
      };

      const response = await chat(requestPayload);
      const assistantContent = response.data?.response || "Não consigo responder";

      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantContent,
        },
      ]);
    } catch (error) {
      console.error("Erro na requisição do chat AI:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Oops! Tive um problema para me conectar ao servidor. Pode tentar de novo?",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const cycleModel = () => {
    setModelIndex((prev) => (prev + 1) % models.length);
  };

  return (
    <div className="w-80 h-screen top-0 right-0 sticky bg-smoke-100 dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 z-50 flex flex-col shadow-2xl duration-300">
      <div className="p-3 flex justify-start">
        <Button 
          variants="circle" 
          colors="secondary" 
          onClick={toggleSideChat}
          className="size-10 flex items-center justify-center"
          title="Fechar painel"
        >
          <X size={24} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col scrollbar">
        {chatHistory.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto select-none">
            <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center mb-3">
              <Sparkles size={22} className="text-yellow-500 dark:text-yellow-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">
              Conte sua necessidade
            </h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 max-w-50">
              Estou aqui para te ajudar na sua vida financeira
            </p>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <ChatMessageText role={msg.role}>
              {msg.content}
            </ChatMessageText>
          ))
        )}

        {isGenerating && (
          <div className="flex flex-col items-start w-full animate-fade-in">
            <span className="text-xs text-slate-400 dark:text-zinc-500 mb-1 px-1">IA</span>
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-3 rounded-tl-none shadow-sm flex items-center gap-1">
              <span className="size-1 bg-slate-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="size-1 bg-slate-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="size-1 bg-slate-400 dark:bg-zinc-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
        <form onSubmit={sendMessage} className="flex flex-col gap-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="Digite sua mensagem"
            className="w-full resize-none bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 rounded-xl p-3 text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 max-h-40 duration-200 placeholder:text-slate-400 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && alert(`Arquivo: ${e.target.files[0].name}`)}
              />
              
              <Button 
                type="button" 
                variants="circle" 
                colors="secondary"
                onClick={() => fileInputRef.current?.click()}
                title="Inserir arquivo"
              >
                <Paperclip size={16} />
              </Button>

              <Button 
                type="button" 
                variants="circle" 
                colors="secondary"
                onClick={cycleModel}
                className="text-xs font-semibold tracking-wide flex items-center gap-1.5"
                title="Trocar modelo de IA"
              >
                <Bot size={16} /> 
                <span className="text-[10px] opacity-80 font-mono">{models[modelIndex]}</span>
              </Button>

              <Button 
                type="button" 
                variants="circle" 
                colors="secondary"
                title="Digitar por voz"
              >
                <Mic size={16} />
              </Button>
            </div>

            <Button
              type="submit"
              variants="circle"
              colors={message.trim() && !isGenerating ? "primary" : "no_color"}
              disabled={!message.trim() || isGenerating}
              className={cn(
                "size-9 flex items-center justify-center shadow-sm transition-all duration-200",
                (!message.trim() || isGenerating) && "bg-slate-100 dark:bg-zinc-800 text-slate-300 dark:text-zinc-600 cursor-not-allowed shadow-none"
              )}
            >
              <SendHorizontal size={15} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SideChat;