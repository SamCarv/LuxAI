import type { Transaction } from "../../../types/transaction"

interface TransactionCategoryModalProps {
    selectedTransaction: Transaction
    onClose: () => void
}

const TransactionCategoryModal = ({ selectedTransaction, onClose }: TransactionCategoryModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-xl animate-in fade-in zoom-in-95">
                <h2 className="text-xl font-bold dark:text-white mb-4">
                    {selectedTransaction ? 'Editar Pagamento' : 'Novo Pagamento'}
                </h2>
                
                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Descrição
                        </label>
                        <input 
                            type="text" 
                            placeholder="Ex: Aluguel, Supermercado..." 
                            className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl dark:text-white outline-none " 
                            defaultValue={selectedTransaction?.description} 
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1.5 w-1/2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Valor
                            </label>
                            <input 
                                type="number" 
                                step="0.01"
                                placeholder="R$ 0,00" 
                                className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl dark:text-white outline-none cursor-pointer" 
                                defaultValue={selectedTransaction?.amount} 
                            />
                            </div>

                            <div className="flex flex-col gap-1.5 w-1/2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Data
                            </label>
                            <input 
                                type="date" 
                                className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl dark:text-white outline-none text-sm cursor-pointer" 
                                defaultValue={selectedTransaction?.date}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Frequência
                        </label>
                        <select className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl dark:text-white border-none text-sm outline-none cursor-pointer">
                            <option value="once">Uma vez</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensal</option>
                            <option value="annually">Anual</option>
                        </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button 
                            onClick={() => onClose()} 
                            className="flex-1 py-3 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button className="flex-1 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors cursor-pointer">
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionCategoryModal