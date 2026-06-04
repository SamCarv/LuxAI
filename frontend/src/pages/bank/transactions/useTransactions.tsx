import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TransactionView } from '../../../types/transaction'
import { transactions, transactionsDetails } from '../constants'

export const useTransactions = () => {
    const nav = useNavigate()
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionView | null>(null)
    const [search, setSearch] = useState('')
    const [advancedFilters, setAdvancedFilters] = useState({
        startDate: '',
        endDate: '',
        type: 'all' as 'all' | 'income' | 'expense',
        approxAmount: '',
        categoryId: ''
    })

    const filteredTransactions = useMemo(() => {
        return transactionsDetails.filter(t => {
            if (t.status !== 'successful') return false

            const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase())
            const matchesType = advancedFilters.type === 'all' ? true : t.type === advancedFilters.type
            const matchesCategory = advancedFilters.categoryId === '' ? true : t.category_id === Number(advancedFilters.categoryId)
            const matchesAmount = advancedFilters.approxAmount === '' ? true : t.amount <= Number(advancedFilters.approxAmount)
            
            let matchesDate = true
            if (advancedFilters.startDate && advancedFilters.endDate) {
                matchesDate = t.date >= advancedFilters.startDate && t.date <= advancedFilters.endDate
            } else if (advancedFilters.startDate) {
                matchesDate = t.date === advancedFilters.startDate
            }

            return matchesSearch && matchesType && matchesCategory && matchesAmount && matchesDate
        })
    }, [search, advancedFilters])

    const totals = useMemo(() => {
        return transactions
            .filter(t => t.status === 'successful')
            .reduce((acc, t) => {
                if (t.type === 'income') acc.income += t.amount
                if (t.type === 'expense') acc.expense += t.amount
                return acc
            }, { income: 0, expense: 0 })
    }, [])

    return {
        nav,
        search,
        setSearch,
        isFilterModalOpen,
        setIsFilterModalOpen,
        selectedTransaction,
        setSelectedTransaction,
        advancedFilters,
        setAdvancedFilters,
        filteredTransactions,
        totals
    }
}