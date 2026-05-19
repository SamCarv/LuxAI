import { ArrowRightLeft, BanknoteArrowUp, FileInput, FileText } from "lucide-react";
import type { Transaction } from "../../types/transaction";

export const transactions: Transaction[] = [
    {
        id: 1,
        amount: 200,
        description: 'descricao',
        type: 'income',
        status: "successful",
        periodicity: "once",
        date: '2026-03-27T14:20:00',
        account_id: 1,
        category_id: 1
    },
    {
        id: 2,
        amount: 400,
        description: 'descricao',
        type: 'expense',
        status: "successful",
        periodicity: "once",
        date: '2026-03-27T13:05:00',
        account_id: 2,
        category_id: 2
    },
    {
        id: 3,
        amount: 140,
        description: 'descricao',
        type: 'expense',
        status: "successful",
        periodicity: "once",
        date: '2026-03-26T13:05:00',
        account_id: 3,
        category_id: 3
    },
]

export const bankOptions = [
    { icon: BanknoteArrowUp, label: 'Transação' },
    { icon: ArrowRightLeft, label: 'Repasse' },
    { icon: FileInput, label: 'CSV' },
    { icon: FileText, label: 'Extrato' }
] 
