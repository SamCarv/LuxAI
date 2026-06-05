import { X } from 'lucide-react'
import { useState } from 'react'
import Modal from '../modal'
import Button from '../button'
import Label from '../label'
import Input from '../input'
import type { CategoryView } from '../../types/category'

interface FilterValues {
    startDate: string
    endDate: string
    type: 'all' | 'income' | 'expense'
    approxAmount: string
    categoryId: string
}

interface FilterModalProps {
    onClose: () => void
    onApplyFilters: (filters: FilterValues) => void
    currentFilters: FilterValues
    categories: CategoryView[]
}

export const FilterModal = ({ onClose, onApplyFilters, currentFilters, categories }: FilterModalProps) => {
    const [filters, setFilters] = useState<FilterValues>(currentFilters)

    const handleClear = () => {
        const cleared = { startDate: '', endDate: '', type: 'all' as const, approxAmount: '', categoryId: '' }
        setFilters(cleared)
    }

    return (
        <Modal className="max-w-md p-6 lg:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filtros Avançados</h2>
                <Button variants="circle" colors="secondary" onClick={onClose}>
                    <X size={18} />
                </Button>
            </div>

            <div className="py-4 space-y-4">
                <div className="flex flex-col gap-2">
                    <Label>Período de Data</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input 
                            type="date" 
                            value={filters.startDate}
                            onChange={e => setFilters({...filters, startDate: e.target.value})}
                        />
                        <Input 
                            type="date" 
                            value={filters.endDate}
                            onChange={e => setFilters({...filters, endDate: e.target.value})}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Tipo de Fluxo</Label>
                    <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
                        {(['all', 'income', 'expense'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setFilters({...filters, type: t})}
                                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                                    filters.type === t 
                                        ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-sm' 
                                        : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                {t === 'all' ? 'Todos' : t === 'income' ? 'Entradas' : 'Saídas'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Valor Máximo Limite</Label>
                    <Input 
                        type="number" 
                        placeholder="Ex: 1500"
                        value={filters.approxAmount}
                        onChange={e => setFilters({...filters, approxAmount: e.target.value})}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Categoria</Label>
                    <select
                        value={filters.categoryId}
                        onChange={e => setFilters({...filters, categoryId: e.target.value})}
                        className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-candy-corn-400"
                    >
                        <option value="">Todas as categorias</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-zinc-800">
                <button onClick={handleClear} className="text-sm font-semibold text-red-500 hover:underline cursor-pointer">
                    Limpar tudo
                </button>
                <div className="flex gap-2">
                    <Button variants="outline" colors="secondary" className="px-4 py-2 rounded-xl text-sm font-semibold" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variants="standard" colors="primary" className="py-2 text-sm" onClick={() => onApplyFilters(filters)}>
                        Aplicar Filtros
                    </Button>
                </div>
            </div>
        </Modal>
    )
}