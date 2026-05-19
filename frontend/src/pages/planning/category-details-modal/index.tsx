import Button from "../../../components/button"
import Input from "../../../components/input"
import Label from "../../../components/label"
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
                        <Label>Descrição</Label>
                        <Input type="text" placeholder="Ex: Aluguel, Supermercado..." defaultValue={selectedTransaction?.description} 
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1.5 w-1/2">
                            <Label>Valor</Label>
                            <Input type="number" step="0.01" placeholder="R$ 0,00" defaultValue={selectedTransaction?.amount} />
                        </div>
                        <div className="flex flex-col gap-1.5 w-1/2">
                            <Label>Data</Label>
                            <Input type="date" defaultValue={selectedTransaction?.date}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Frequência</Label>
                        <select className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl dark:text-white border-none text-sm outline-none cursor-pointer">
                            <option value="once">Uma vez</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensal</option>
                            <option value="annually">Anual</option>
                        </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button variants="standard" colors="secondary" onClick={() => onClose()} className="flex-1">
                            Cancelar
                        </Button>
                        <Button variants="standard" colors="primary" className="flex-1">
                            Salvar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionCategoryModal