import type { Transaction, TransactionView } from "./transaction"

type Category = {
    id: number,
    name: string,
    icon: string,
    color: string,
    description: string,
    transactions: Transaction[]
    user_id: number,
}

type CategoryView = {
    id: string,
    name: string,
    color: string,
    icon: string,
    description: string,
    transactions: TransactionView[]
    user_id: string,
}

type CreateCategory = {
    name: string,
    color: string,
    icon: string,
    description: string,
}

type UpdateCategory = {
    name: string,
    color: string,
    icon: string,
    description: string,
}

export type { Category, CreateCategory, UpdateCategory, CategoryView }