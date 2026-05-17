export type TransactionType = "income" | "expense" | undefined
export type StatusTransactionType = "failed" | "pending" | "successful"
export type PeriodicityType = "once" | "weekly" | "monthly" | "annually";

export type Transaction = {
    id: number,
    description: string,
    amount: number,
    date: string,
    type: TransactionType,
    status: StatusTransactionType,
    periodicity: PeriodicityType, 
    category_id: number,
    account_id: number
}