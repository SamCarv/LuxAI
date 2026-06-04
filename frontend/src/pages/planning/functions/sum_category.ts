import type { TransactionView } from "../../../types/transaction"

export const sumBalanceCategory = (transactions: TransactionView[] | undefined): string => {
    if (!transactions || transactions.length === 0) return "0.00"

    const sum = transactions.reduce((acc: number, transaction: TransactionView) => {
        const amount = transaction && transaction.amount ? Number(transaction.amount) : 0;
        
        return acc + amount;
    }, 0)

    if (isNaN(sum)) return "0.00"

    return sum.toFixed(2)
}