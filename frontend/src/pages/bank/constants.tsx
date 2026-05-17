import type { Transaction } from "../../types/transaction";

export const transactions: Transaction[] = [
    {
        id: 1,
        amount: 200,
        description: 'descricao',
        type: 'income',
        date: '2026-03-27T14:20:00',
        account_id: 1,
        category_id: 1
    },
    {
        id: 2,
        amount: 400,
        description: 'descricao',
        type: 'expense',
        date: '2026-03-27T13:05:00',
        account_id: 2,
        category_id: 2
    },
    {
        id: 3,
        amount: 140,
        description: 'descricao',
        type: 'expense',
        date: '2026-03-26T13:05:00',
        account_id: 3,
        category_id: 3
    },
]


