export type TransactionType = "income" | "expense" | undefined

export type Transaction = {
    id: number,
    description: string,
    amount: number,
    date: string,
    type: TransactionType,
    category_id: number,
    account_id: number
}