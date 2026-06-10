import { Landmark, Target, TrendingUp, Wallet } from "lucide-react";

export const SUGGESTIONS = [
  {
    label: "Criar um orçamento",
    prompt: "Gostaria de criar um orçamento mensal. Pode me ajudar a dividir meus gastos usando a regra 50/30/20?",
    icon: Wallet,
  },
  {
    label: "Definir metas de economia",
    prompt: "Preciso montar uma estratégia para poupar dinheiro e criar minha reserva de emergência. Por onde começo?",
    icon: Target,
  },
  {
    label: "Analisar meus gastos",
    prompt: "Vou te passar uma lista dos meus gastos recentes para você me ajudar a identificar onde posso cortar despesas.",
    icon: TrendingUp,
  },
  {
    label: "Dicas de investimentos",
    prompt: "Sou iniciante no mundo dos investimentos. Quais são as opções mais seguras para começar a render meu dinheiro?",
    icon: Landmark,
  },
];