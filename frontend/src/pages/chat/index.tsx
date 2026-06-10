import { useState, useRef, useEffect } from "react";
import { Paperclip, Bot, Mic, SendHorizontal, Sparkles, KeyRound, Copy } from "lucide-react";
import Button from "../../components/button/index";
import ChatMessageText from "../../components/chat-message/index";
import { cn } from "../../lib/utils";
import type { ChatAttachment, ChatMessage, ChatRequest } from "../../types/chat";
import { chat } from "../../services/chat";
import { useLocation } from "react-router-dom";
import { SUGGESTIONS } from "./constants";
import { toast } from "sonner";

const models = ["ollama", "Gemini"];

const Chat = () => {
  const [message, setMessage] = useState("");
  const [modelIndex, setModelIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeminiConfigured, setIsGeminiConfigured] = useState(() => {return localStorage.getItem("luxai_api_key_configured") === "true"});

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setIsGeminiConfigured(localStorage.getItem("luxai_api_key_configured") === "true");
  }, []);

  useEffect(() => {
    const autoMessage = location.state?.autoSendMessage;

    if (autoMessage && chatHistory.length === 0 && !isGenerating && !isGeminiConfigured) {
      sendMessageFlow(autoMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, chatHistory]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isGenerating]);

  const checkConfiguration = async() => {
    try {
      const hasKey = await chat({message: "testando conexão", attachments: [], history: []});
      if (hasKey.status === 200) {
        setIsGeminiConfigured(true);
      } 
    }catch (error: any) {
      toast.error("Chave não encontrada! Por favor, siga o passo a passo e salve a chave nas configurações do seu perfil antes de clicar.",{duration: 8000});
    }
  };

  const sendMessageFlow = async (textToSend: string) => {
    const currentAttachments = [...attachments];
    const newUserMessage: ChatMessage = { role: "user", content: textToSend };

    setChatHistory((prev) => [...prev, newUserMessage]);
    setIsGenerating(true);

    try {
      const formattedHistory= chatHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const requestPayload: ChatRequest = {
        message: textToSend,
        history: formattedHistory,
        attachments: currentAttachments,
      };

      const response = await chat(requestPayload);
      const assistantContent = response.data?.response || "Não consigo responder";

      setChatHistory((prev) => [...prev, { role: "assistant", content: assistantContent }]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Oops! Tive um problema para me conectar ao servidor. Pode tentar de novo?" },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isGenerating) return;

    const userText = message;
    setMessage("");
    setAttachments([]);
    await sendMessageFlow(userText);
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
        <div className="max-w-3xl mx-auto w-full pt-8 pb-40 px-4 space-y-6 flex flex-col h-full justify-center">
          {!isGeminiConfigured ? (
            <div className="bg-zinc-50 w-full max-w-lg dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 space-y-5 my-auto mx-auto shadow-xs">
              <div className="p-3 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <KeyRound size={22} />
              </div>
              
              <div className="space-y-2 text-center">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Conecte sua Inteligência Artificial</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Para habilitar os módulos analíticos e os relatórios de diagnóstico, insira sua própria chave de acesso do <strong className="text-zinc-800 dark:text-zinc-200">Google Gemini</strong>.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] space-y-2 text-zinc-600 dark:text-zinc-400">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">Passo a passo para configurar:</p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                  <li>Acesse o site do <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-yellow-600 dark:text-yellow-400 underline font-medium">Google AI Studio</a>.</li>
                  <li>Na parte lateral inferior, clique em <span className="font-medium text-zinc-900 dark:text-white">"Get API Key"</span> e copie a sua chave clicando no ícone de copiar <Copy size={10} className="inline-block ml-1 align-middle"/></li>
                  <li>Aqui na nossa plataforma, vá até a <span className="font-medium text-zinc-900 dark:text-white">Sidebar (barra lateral esquerda)</span>.</li>
                  <li>Na parte inferior, procure pelo seu <span className="font-medium text-zinc-900 dark:text-white">Nome de Usuário</span> e clique nele.</li>
                  <li>No painel que se abrir, acesse a seção <span className="font-medium text-zinc-900 dark:text-white">"IA"</span>.</li>
                  <li>Selecione o provedor <span className="font-semibold">Gemini</span> e cole a chave copiada.</li>
                </ol>
              </div>

              <Button type="button" variants='standard' colors='primary' onClick={checkConfiguration} className="w-full text-xs font-semibold">
                Entendi, já configurei
              </Button>
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 mb-12 select-none animate-fade-in w-full">
              <div className="size-14 rounded-full bg-yellow-100 dark:bg-yellow-900/60 flex items-center justify-center mb-4 shadow-xs">
                <Sparkles size={26} className="text-yellow-500 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
                Como posso ajudar você hoje?
              </h3>
              <p className="text-sm text-slate-400 dark:text-zinc-400 mt-1 mb-8 max-w-sm leading-relaxed">
                Você gostaria de...
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
                {SUGGESTIONS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => sendMessageFlow(item.prompt)}
                      className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:border-yellow-400 dark:hover:border-yellow-400 hover:bg-slate-50/50 dark:hover:bg-zinc-700 active:scale-[0.99] transition-all duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 group-hover:bg-yellow-400/25 group-hover:text-yellow-600 dark:group-hover:bg-yellow-800/30 dark:group-hover:text-yellow-400 transition-colors duration-200 shrink-0">
                        <Icon size={16} />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
                          {item.label}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-zinc-400 mt-0.5">
                          {item.prompt}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <ChatMessageText key={index} role={msg.role} className="animate-fade-in">
                {msg.content}
              </ChatMessageText>
            ))
          )}

          {isGenerating && (
            <div className="flex flex-col items-start w-full animate-fade-in">
              <span className="text-xs text-slate-400 dark:text-zinc-500 mb-1 px-1">
                Lux - AI
              </span>
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-3.5 rounded-tl-none shadow-xs flex items-center gap-1.5">
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
            onSubmit={sendMessage}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-3 shadow-md focus-within:ring-2 focus-within:ring-yellow-400/40 focus-within:border-yellow-400/60 duration-200 flex flex-col gap-2"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!isGeminiConfigured}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder={!isGeminiConfigured ? "Envie uma mensagem para o Lux..." : "Configure a sua chave Gemini no perfil para conversar..."}
              className="w-full resize-none bg-transparent px-2 pt-1 text-base sm:text-sm text-slate-800 dark:text-zinc-200 focus:outline-none max-h-48 placeholder:text-slate-400 dark:placeholder:text-zinc-500 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] disabled:cursor-not-allowed"
            />

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/50 pt-2 mt-1">
              <div className="flex items-center gap-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && alert(`Arquivo: ${e.target.files[0].name}`)
                  }
                />

                <Button
                  type="button"
                  variants="circle"
                  colors="secondary"
                  disabled={!isGeminiConfigured}
                  onClick={() => fileInputRef.current?.click()}
                  className="size-8 flex items-center justify-center text-slate-500 dark:text-zinc-400 disabled:opacity-50"
                  title="Inserir arquivo"
                >
                  <Paperclip size={15} />
                </Button>

                <Button
                  type="button"
                  variants="circle"
                  colors="secondary"
                  disabled={!isGeminiConfigured}
                  className="size-8 flex items-center justify-center text-slate-500 dark:text-slate-400 disabled:opacity-50"
                  title="Digitar por voz"
                >
                  <Mic size={15} />
                </Button>
              </div>

              <Button
                type="submit"
                variants="circle"
                colors={message.trim() && !isGenerating && !isGeminiConfigured ? "primary" : "no_color"}
                disabled={!message.trim() || isGenerating || !isGeminiConfigured}
                className={cn(
                  "size-8 flex items-center justify-center shadow-xs transition-all duration-200 rounded-xl",
                  !message.trim() || isGenerating || !isGeminiConfigured
                    ? "bg-slate-100 dark:bg-zinc-800 text-slate-300 dark:text-zinc-600 cursor-not-allowed shadow-none"
                    : "bg-yellow-400 text-black hover:bg-yellow-500",
                )}
              >
                <SendHorizontal size={14} />
              </Button>
            </div>
          </form>
          <div className="text-sm text-center text-slate-400 dark:text-zinc-600 mt-2">
            O Lux AI pode cometer erros. Considere verificar informações importantes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;