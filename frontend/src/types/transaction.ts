export type TransactionType = "income" | "expense" | undefined;
export type StatusTransactionType = "failed" | "pending" | "successful";
export type PeriodicityType = "none" | "daily" | "weekly" | "monthly";

type Transaction = {
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

type TransactionView = {
    id: string,
    description: string,
    amount: number,
    date: string,
    type: TransactionType,
    status: StatusTransactionType,
    recurrence_frequency: PeriodicityType,
    recurrence_day: number
    category_id: number,
    account_id: number
}

export type { Transaction, TransactionView }