import { X, Calendar, Repeat, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import type { Transaction } from '../../types/transaction'
import Modal from '../modal'
import Button from '../button'
import { DynamicIcon, type IconName } from '../../pages/planning/dynamic-icon'
import { categories } from '../../utils/constants.planning'

interface TransactionDetailsModalProps {
    transaction: Transaction | null
    onClose: () => void
}

export const TransactionDetailsModal = ({ transaction, onClose }: TransactionDetailsModalProps) => {
    if (!transaction) return null

    const category = categories.find(c => c.id === transaction.category_id)

    return (
        <Modal className="max-w-sm p-6">
            <div className="absolute right-6 top-6">
                <Button variants="circle" colors="secondary" onClick={onClose}>
                    <X size={18} />
                </Button>
            </div>

            <div className="text-center pt-4 pb-6">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-950/40' : 'bg-red-100 text-red-600 dark:bg-red-950/40'
                }`}>
                    {transaction.type === 'income' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 px-4">{transaction.description}</h3>
                <p className={`text-2xl font-black mt-2 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                </p>
            </div>

            <div className="space-y-3 text-sm pb-6">
                <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-400">Categoria</span>
                    {category ? (
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[12px]`} style={{ backgroundColor: `#${category.color}`}}>
                            <DynamicIcon name={category.icon as IconName} size={14} />
                            {category.name}
                        </span>
                    ) : (
                        <span className="text-gray-500">Geral</span>
                    )}
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-400">Data de Liquidação</span>
                    <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-semibold">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-400">Periodicidade</span>
                    <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-semibold capitalize">
                        <Repeat size={14} className="text-gray-400" />
                        {transaction.periodicity}
                    </span>
                </div>

                <div className="flex items-center justify-between py-2.5">
                    <span className="text-gray-400">Status</span>
                    <span className="px-2.5 py-0.5 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/30 rounded-md">
                        Concluído
                    </span>
                </div>
            </div>

            <Button variants="standard" colors="secondary" className="w-full py-2.5 text-sm font-semibold rounded-xl" onClick={onClose}>
                Fechar
            </Button>
        </Modal>
    )
}