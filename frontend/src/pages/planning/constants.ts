import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { type ChartConfig } from "../../components/ui/chart";
import { categories } from "../../utils/constants.planning";
import { type MockPeriodData } from "./types";
import { BarChart2, Edit3, GitCompare, type LucideProps } from "lucide-react";

export const chartConfig = {
  current: { label: "Período Atual", color: "hsl(var(--primary))" },
  previous: { label: "Período Anterior", color: "grid-slate-400" },
  expense: { label: "Despesas" },
  income: { label: "Recebimentos" },
  profit: { label: "Lucro Líquido" }
} satisfies ChartConfig;

export const VIEWS = [
  { id: 'expense', label: 'Despesas', color: 'bg-red-500' },
  { id: 'income', label: 'Receitas', color: 'bg-green-500' },
  { id: 'profit', label: 'Saldo', color: 'bg-blue-500' },
] as const;

export const PERIODS = [
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
  { id: 'year', label: 'Ano' },
  { id: 'custom', label: 'Personalizado' },
] as const;

export const DetailCategoryOptions =  [
  { icon: BarChart2, label: "Gráfico" },
  { icon: GitCompare, label: "Comparação" },
  { icon: Edit3, label: "Editar" },
]

export const mockPeriodData: MockPeriodData = {
  expense: {
    current: categories.map(c => ({ name: c.name, value: 1900, color: `#${c.color}` })),
    previous: categories.map(c => ({ name: c.name, value: 1600, color: `#${c.color}` })),
    totalCurrent: 7600,
    totalPrevious: 6400
  },
  income: {
    current: [{ name: "Salário", value: 5000 }, { name: "Freelance", value: 1200 }],
    previous: [{ name: "Salário", value: 5000 }, { name: "Freelance", value: 800 }],
    totalCurrent: 6200,
    totalPrevious: 5800
  }
};