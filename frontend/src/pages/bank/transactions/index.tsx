import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, Search, Filter } from 'lucide-react'
import Button from '../../../components/button'
import Input from '../../../components/input'
import { DynamicIcon, type IconName } from '../../planning/dynamic-icon'
import { FilterModal } from '../../../components/filter-payment-modal'
import { TransactionDetailsModal } from '../../../components/detail-payment-modal'
import { categories } from '../../../utils/constants.planning'
import { useTransactions } from './useTransactions'

const Transactions = () => {
    const {
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
    } = useTransactions();

    return (
        <div className='flex flex-col w-full h-full px-10 md:px-40 py-6 gap-y-6 text-gray-800 dark:text-gray-100'>
            <button onClick={() => nav(-1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-paris-daisy-600 dark:hover:text-paris-daisy-400 transition-colors w-fit cursor-pointer">
                <ChevronLeft size={24} />
                <span className="font-medium">Voltar</span>
            </button>

            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold tracking-tight'>Histórico de Transações</h1>
                <button title='Ir para planejamento' onClick={() => nav('../planning')} className='flex gap-4 px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm transition-all cursor-pointer text-sm'>
                    <span className='flex items-center gap-1 text-green-600 font-medium'><ArrowUp size={16} /> R$ {Number(totals.income).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className='flex items-center gap-1 text-red-600 font-medium'><ArrowDown size={16} /> R$ {Number(totals.expense).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className='flex items-center gap-1 text-zinc-600 dark:text-gray-300 font-medium'><ArrowUpDown size={16} /> R$ {Number(totals.income - totals.expense).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </button>
            </div>

            <div className='flex gap-4 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 justify-between items-center'>
                <div className='relative w-full sm:w-72'>
                    <Search className='absolute left-4 top-3.5 h-4 w-4 text-gray-400 z-10' />
                    <Input 
                        type="text"
                        placeholder="Buscar por descrição"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-11"
                    />
                </div>

                <Button 
                    variants="outline" 
                    colors="secondary" 
                    onClick={() => setIsFilterModalOpen(true)}
                    className="gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-gray-200 dark:border-zinc-700"
                >
                    <Filter size={16} className='text-gray-400' />
                    Filtros Avançados
                </Button>
            </div>

            <table className='bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm'>
                <thead>
                    <tr className='grid grid-cols-5 bg-gray-50 dark:bg-zinc-800/50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-zinc-800'>
                        <th className='text-left'>Descrição</th>
                        <th className='text-center'>Tipo</th>
                        <th className='text-center'>Categoria</th>
                        <th className='text-center'>Data</th>
                        <th className='text-right'>Valor</th>
                    </tr>
                </thead>

                <tbody className='divide-y divide-gray-100 dark:divide-zinc-800/60'>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => {
                            const category = categoriesMap.get(transaction.category_id)
                            
                            return (
                                <tr 
                                    key={transaction.id} 
                                    onClick={() => setSelectedTransaction(transaction)}
                                    className='grid grid-cols-5 px-6 py-4 items-center text-sm hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors cursor-pointer'
                                >
                                    <td>
                                        <p className='font-semibold text-gray-900 dark:text-white'>{transaction.description}</p>
                                        <span className='text-xs text-gray-400 capitalize'>{transaction.recurrence_frequency}</span>
                                    </td>
                                    
                                    <td className='flex justify-center'>
                                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${transaction.type === 'income' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                                            {transaction.type === 'income' ? 'Entrada' : 'Saída'}
                                        </span>
                                    </td>

                                    <td className='flex justify-center'>
                                        {category ? (
                                            <span style={{ backgroundColor: `#${category.color}`, borderColor: `#${category.color}`}} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold dark:text-black`}>
                                                <DynamicIcon name={category.icon as IconName} size={14} />
                                                {category.name}
                                            </span>
                                        ) : (
                                            <span className='text-xs text-gray-400'>Geral</span>
                                        )}
                                    </td>

                                    <td className='text-center text-gray-500 dark:text-gray-400 font-medium'>
                                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                    </td>

                                    <td className={`text-right font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {transaction.type === 'income' ? '+ ' : '- '}
                                        R$ {Number(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <div className='p-12 text-center text-gray-400 text-sm font-medium'>
                            Nenhum registro encontrado para os filtros aplicados.
                        </div>
                    )}
                </tbody>
            </table>

            {isFilterModalOpen && <FilterModal 
                onClose={() => setIsFilterModalOpen(false)}
                currentFilters={advancedFilters}
                onApplyFilters={(filters) => {
                    setAdvancedFilters(filters)
                    setIsFilterModalOpen(false)
                }}
                categories={categories}
            />}

            <TransactionDetailsModal 
                transaction={selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
            />
        </div>
    )
}

export default Transactions