import { useState, useRef, useEffect } from "react";
import { Paperclip, Bot, Mic, SendHorizontal, Sparkles } from "lucide-react";
import Button from "../../components/button/index";
import ChatMessageText from "../../components/chat-message/index";
import { cn } from "../../lib/utils";
import type { ChatAttachment, ChatMessage, ChatRequest } from "../../types/chat";
import { chat } from "../../services/chat";

const models = ["ollama", "Gemini"];

const Chat = () => {
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isGenerating]);

  const handleSendMessage = async (e: React.FormEvent) => {
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
      const assistantContent =
        response.data?.response || "Não consigo responder";

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
          content:
            "Oops! Tive um problema para me conectar ao servidor. Pode tentar de novo?",
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
    <div className="flex flex-col w-full h-full items-center duration-300 overflow-hidden">
      <header className="w-full max-w-3xl h-14 border-b border-slate-200/80 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variants="circle"
            colors="secondary"
            onClick={cycleModel}
            className="px-3 py-1.5 h-auto rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 border border-slate-200 dark:border-zinc-800"
            title="Trocar modelo de IA"
          >
            <Bot size={15} className="text-slate-500 dark:text-zinc-400" />
            <span className="text-[11px] font-mono text-slate-700 dark:text-zinc-300 capitalize">
              {models[modelIndex]}
            </span>
          </Button>
        </div>
        <div className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
          Lux Assistant
        </div>
      </header>

      <div className="flex-1 w-full overflow-y-auto scrollbar">
        <div className="max-w-3xl mx-auto w-full pt-8 pb-36 space-y-6 flex flex-col h-full justify-center">
          {chatHistory.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mb-20 select-none animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-yellow-400/10 flex items-center justify-center mb-4 shadow-sm border border-yellow-400/20">
                <Sparkles
                  size={26}
                  className="text-yellow-500 dark:text-yellow-400"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
                Como posso ajudar você hoje?
              </h3>
              <p className="text-sm text-slate-400 dark:text-zinc-500 mt-2 max-w-sm leading-relaxed">
                Estou aqui para organizar sua vida financeira e orientar suas escolhas
                de gastos e metas.
              </p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <ChatMessageText
                key={index}
                role={msg.role}
                className="animate-fade-in"
              >
                {msg.content}
              </ChatMessageText>
            ))
          )}

          {isGenerating && (
            <div className="flex flex-col items-start w-full animate-fade-in">
              <span className="text-xs text-slate-400 dark:text-zinc-500 mb-1 px-1">
                Lux - AI
              </span>
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-3.5 rounded-tl-none shadow-sm flex items-center gap-1.5">
                <span className="size-1.5 bg-slate-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="size-1.5 bg-slate-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="size-1.5 bg-slate-400 dark:bg-zinc-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="w-full fixed self-center bottom-0 bg-linear-to-t from-slate-50 via-slate-50/95 to-transparent dark:from-zinc-950 dark:via-zinc-950/95 pt-6 pb-6 px-4 z-0">
        <div className="max-w-3xl mx-auto w-full">
          <form
            onSubmit={handleSendMessage}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-3 shadow-md focus-within:ring-2 focus-within:ring-yellow-400/40 focus-within:border-yellow-400/60 duration-200 flex flex-col gap-2"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Envie uma mensagem para o Lux..."
              className="w-full resize-none bg-transparent px-2 pt-1 text-base sm:text-sm text-slate-800 dark:text-zinc-200 focus:outline-none max-h-48 placeholder:text-slate-400 dark:placeholder:text-zinc-500 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            />

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/50 pt-2 mt-1">
              <div className="flex items-center gap-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    alert(`Arquivo: ${e.target.files[0].name}`)
                  }
                />

                <Button
                  type="button"
                  variants="circle"
                  colors="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="size-8 flex items-center justify-center text-slate-500 dark:text-zinc-400"
                  title="Inserir arquivo"
                >
                  <Paperclip size={15} />
                </Button>

                <Button
                  type="button"
                  variants="circle"
                  colors="secondary"
                  className="size-8 flex items-center justify-center text-slate-500 dark:text-zinc-400"
                  title="Digitar por voz"
                >
                  <Mic size={15} />
                </Button>
              </div>

              <Button
                type="submit"
                variants="circle"
                colors={
                  message.trim() && !isGenerating ? "primary" : "no_color"
                }
                disabled={!message.trim() || isGenerating}
                className={cn(
                  "size-8 flex items-center justify-center shadow-sm transition-all duration-200 rounded-xl",
                  !message.trim() || isGenerating
                    ? "bg-slate-100 dark:bg-zinc-800 text-slate-300 dark:text-zinc-600 cursor-not-allowed shadow-none"
                    : "bg-yellow-400 text-black hover:bg-yellow-500",
                )}
              >
                <SendHorizontal size={14} />
              </Button>
            </div>
          </form>
          <div className="text-sm text-center text-slate-400 dark:text-zinc-600 mt-2">
            O Lux AI pode cometer erros. Considere verificar informações
            importantes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
