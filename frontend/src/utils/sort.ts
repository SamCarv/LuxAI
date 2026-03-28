import {isToday, isYesterday, format} from 'date-fns'
import type { Transaction } from '../types/transaction'

export const groupTransaction = (transactions: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {}

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date)

    let key = ""

    if (isToday(date)) {
      key = "today"
    } else if (isYesterday(date)) {
      key = "yesterday"
    } else {
      key = format(date, "dd/MM")
    }

    if (!groups[key]) {
      groups[key] = []
    }

    groups[key].push(transaction)
  })

  return groups
}