import { ArrowRightLeft, BanknoteArrowUp, FileInput, FileText, Monitor } from "lucide-react";
import type { Transaction } from "../../types/transaction";
import type { ChartConfig } from "../../components/ui/chart";

export const transactions: Transaction[] = [
    { id: 1, description: "Salário", amount: 5000, date: "2026-03-27T13:05:00", type: "income", status: "successful", periodicity: "monthly", category_id: 1, account_id: 1 },
    { id: 2, description: "Supermercado", amount: 350.50, date: "2026-03-26T13:05:00", type: "expense", status: "successful", periodicity: "once", category_id: 2, account_id: 1 },
    { id: 3, description: "Assinatura Streaming", amount: 55.90, date: "2026-03-27T14:20:00", type: "expense", status: "successful", periodicity: "monthly", category_id: 3, account_id: 1 },
]

export const transactionsDetails: Transaction[] = [
    { id: 1, description: "Salário", amount: 5000, date: "2026-03-27T13:05:00", type: "income", status: "successful", periodicity: "monthly", category_id: 1, account_id: 1 },
    { id: 2, description: "Supermercado", amount: 350.50, date: "2026-03-26T13:05:00", type: "expense", status: "successful", periodicity: "once", category_id: 2, account_id: 1 },
    { id: 3, description: "Assinatura Streaming", amount: 55.90, date: "2026-03-27T14:20:00", type: "expense", status: "successful", periodicity: "monthly", category_id: 3, account_id: 1 },
    { id: 4, description: "Freelance Design", amount: 1200, date: "2026-03-25T12:00:00", type: "income", status: "successful", periodicity: "once", category_id: 1, account_id: 1 },
    { id: 5, description: "Internet", amount: 120, date: "2026-03:20T21:30:00", type: "expense", status: "successful", periodicity: "monthly", category_id: 4, account_id: 1 },
]

export const bankOptions = [
    { icon: BanknoteArrowUp, label: 'Transação' },
    { icon: ArrowRightLeft, label: 'Repasse' },
    { icon: FileInput, label: 'CSV' },
    { icon: FileText, label: 'Extrato' }
]


export const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

export const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: Monitor,
    color: "#ECC900",
  },
  mobile: {
    label: "Mobile",
    icon: Monitor,
    color: "#FFDF25",
  },
} satisfies ChartConfig


