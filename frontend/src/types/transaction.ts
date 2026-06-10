export type TransactionType = "income" | "expense" | undefined;
export type StatusTransactionType = "failed" | "pending" | "success";
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
    category_id: string,
    account_id: string,
}

type CreateTransaction = {
    description: string,
    amount: number,
    type: TransactionType,
    category_id: string,
    account_id: string,
    date: string,
    recurrence_frequency: PeriodicityType,
    recurrence_day: number | null,
    status: StatusTransactionType,
    failure_reason: string | null
}

type UpdateTransaction = {
    description: string,
    amount: number,
    type: TransactionType,
    category_id: string,
    account_id: string,
    recurrence_frequency: PeriodicityType,
    recurrence_day: number | null,
    status: StatusTransactionType,
    failure_reason: string | null
}

export type { Transaction, TransactionView, CreateTransaction, UpdateTransaction }