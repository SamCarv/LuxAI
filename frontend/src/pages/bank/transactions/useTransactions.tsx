import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TransactionView } from '../../../types/transaction'
import { useQuery } from '@tanstack/react-query'
import { list_transactions } from '../../../services/transaction'
import { list_categories } from '../../../services/category'

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
    
    const { data: transactions = []} = useQuery({queryKey:['transactions'], queryFn: list_transactions});
    const { data: categories = [] } = useQuery({queryKey: ['categories'],queryFn: list_categories});

    const categoriesMap = useMemo(() => {
        const map = new Map();
        categories.forEach(cat => {
            map.set(cat.id, cat);
        });
        return map;
    }, [categories]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            if (t.status !== 'success') return false

            const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase())
            const matchesType = advancedFilters.type === 'all' ? true : t.type === advancedFilters.type
            const matchesCategory = advancedFilters.categoryId === '' ? true : t.category_id === advancedFilters.categoryId
            const matchesAmount = advancedFilters.approxAmount === '' ? true : t.amount <= Number(advancedFilters.approxAmount)
            
            let matchesDate = true
            if (advancedFilters.startDate && advancedFilters.endDate) {
                matchesDate = t.date >= advancedFilters.startDate && t.date <= advancedFilters.endDate
            } else if (advancedFilters.startDate) {
                matchesDate = t.date === advancedFilters.startDate
            }

            return matchesSearch && matchesType && matchesCategory && matchesAmount && matchesDate
        })
    }, [transactions, search, advancedFilters])

    const totals = useMemo(() => {
        return transactions
            .filter(t => t.status === 'success')
            .reduce((acc, t) => {
                if (t.type === 'income') acc.income += Number(t.amount)
                if (t.type === 'expense') acc.expense += Number(t.amount)
                return acc
            }, { income: 0, expense: 0 })
    }, [transactions])

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
        categoriesMap,
        categories,
        totals
    }
}