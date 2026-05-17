import type { Transaction } from "./transaction"

export type Category = {
    id: number,
    name: string,
    icon: string,
    color: string,
    description: string,
    transactions: Transaction[]
    user_id: number,
}