import { Minus, Plus } from "lucide-react"
import type { TransactionType } from "../../types/transaction"

export const getColor = (transactionType: TransactionType) => {
    const color = transactionType === "income"
      ? "text-green-500"
      : transactionType === "expense"
      ? "text-red-500"
      : ""
    return color
}
    
export const getIcon = (transactionType: TransactionType) => {
    const icon = transactionType === "expense"
    ? Minus
    : transactionType === "income"
    ? Plus
    : null 

    return icon
}