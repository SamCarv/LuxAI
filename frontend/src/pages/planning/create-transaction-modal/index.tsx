import { useEffect, useState } from "react"
import Button from "../../../components/button"
import Input from "../../../components/input"
import Label from "../../../components/label"
import Modal from "../../../components/modal"
import type { CreateTransaction, PeriodicityType, StatusTransactionType, TransactionType, TransactionView, UpdateTransaction } from "../../../types/transaction"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CategoryView } from "../../../types/category"
import { get_bank_accounts } from "../../../services/account"
import { formatDateForInput } from "../functions/date"
import { create_transaction, update_transaction } from "../../../services/transaction"
import InputMoney from "../../../components/input/input-money"

interface TransactionCategoryModalProps {
    selectedTransaction?: TransactionView | null,
    category?: CategoryView | null,
    categories?: CategoryView[] | null,
    onClose: () => void
}

const TransactionCategoryModal = ({ selectedTransaction, category, categories, onClose }: TransactionCategoryModalProps) => {
    const queryClient = useQueryClient();
    const {data: accounts = []} = useQuery({queryKey: ["accounts"], queryFn: get_bank_accounts});
    const [type, setType] = useState<TransactionType>(selectedTransaction?.type || "expense");
    const [description, setDescription] = useState(selectedTransaction?.description ||"");
    const [amount, setAmount] = useState<number>(selectedTransaction?.amount || 0);
    const [date, setDate] = useState<string>(formatDateForInput(selectedTransaction?.date) || new Date().toISOString().slice(0,16));
    const [status, setStatus] = useState<StatusTransactionType>(selectedTransaction?.status || "pending");
    const [periodicity, setPeriodicity] = useState<PeriodicityType>(selectedTransaction?.recurrence_frequency || "none");
    const [recurrencyDay, setRecurrencyDay] = useState<number | null>(selectedTransaction?.recurrence_day || null);
    const [accountId, setAccountId] = useState<string>(accounts[0]?.id || "");
    const [categoryId, setCategoryId] = useState<string>(category?.id || (categories && categories[0]?.id)  || "");

    useEffect(() => {
        if (accounts.length > 0 && !selectedTransaction && !accountId) {
            setAccountId(accounts[0].id);
        }
    }, [accounts, selectedTransaction, accountId]);

    useEffect(() => {
        if (category?.id) {
            setCategoryId(category.id);
        } else if (categories && categories.length > 0 && !categoryId) {
            setCategoryId(categories[0].id);
        }
    }, [category, categories]);

    const createTransactionMutation = useMutation({
        mutationFn: (createTransaction: CreateTransaction) => create_transaction(createTransaction),
        onSuccess: () => {
            if(category) queryClient.invalidateQueries({ queryKey: ['category', category.id]})
            queryClient.invalidateQueries({ queryKey: ['categories']})
        }
    })

    const updateTransactionMutation = useMutation({
        mutationFn: ({id, updateTransaction}: {id: string, updateTransaction: UpdateTransaction}) => update_transaction(id, updateTransaction),
        onSuccess: () => {
            if(category) queryClient.invalidateQueries({ queryKey: ['category', category.id]})
            queryClient.invalidateQueries({ queryKey: ['categories']})
        }
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if(!selectedTransaction) {
            createTransactionMutation.mutate({
                description,
                amount,
                type,
                status,
                date,
                account_id: accountId,
                category_id: categoryId,
                recurrence_frequency: periodicity,
                recurrence_day: recurrencyDay,
                failure_reason: null,
            })
        };

        if(selectedTransaction) {
            updateTransactionMutation.mutate({
                id: selectedTransaction.id,
                updateTransaction: {
                    description,
                    amount,
                    type,
                    status,
                    account_id: accountId,
                    category_id: categoryId,
                    recurrence_frequency: periodicity,
                    recurrence_day: recurrencyDay,
                    failure_reason: null,
                }
            })
        };

        onClose();
    };

    return (
        <Modal>
            <h2 className="text-xl font-bold dark:text-white mb-4">Nova Transação</h2>

            <form onSubmit={submit} className="space-y-4">
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-2xl">
                    <button
                    type="button"
                    onClick={() => setType("income")}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                        type === "income" 
                        ? "bg-green-500 text-white shadow-md" 
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                    }`}
                    >
                        Receita
                    </button>
                    <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                        type === "expense" 
                        ? "bg-red-500 text-white shadow-md" 
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                    }`}
                    >
                        Despesa
                    </button>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label>Descrição</Label>
                    <Input type="text" required placeholder="Salário, Gasolina..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 w-1/2">
                        <Label>Valor</Label>
                        <InputMoney required placeholder="R$ 0,00" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
                    </div>

                    <div className="flex flex-col gap-1.5 w-1/2">
                        <Label>Data</Label>
                        <Input type="datetime-local" required value={date} onChange={(e) => setDate(e.target.value)}/>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 w-1/2">
                        <Label>Conta</Label>
                        <select 
                            className="w-full bg-gray-100 dark:bg-zinc-700 p-3 rounded-xl dark:text-white border-none text-sm outline-none cursor-pointer"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                        >
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>{account.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 w-1/2">
                        <Label>Status da transação</Label>
                        <select 
                            className="w-full bg-gray-100 dark:bg-zinc-700 p-3 rounded-xl dark:text-white border-none text-sm outline-none cursor-pointer"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as StatusTransactionType)}
                        >
                            <option value="success">Sucedido</option>
                            <option value="pending">Pendente</option>
                            <option value="failed">Falhado</option>
                        </select>
                    </div>
                </div>

                
                <div className="flex gap-3">
                    <div className={`flex flex-col gap-1.5 ${periodicity === "monthly" ? "w-1/2" : "w-full"} transition-all`}>
                        <Label>Frequência</Label>
                        <select 
                            className="w-full bg-gray-100 dark:bg-zinc-700 p-3 rounded-xl dark:text-white border-none text-sm outline-none cursor-pointer"
                            value={periodicity}
                            onChange={(e) => {
                                const val = e.target.value as PeriodicityType;
                                setPeriodicity(val);
                                if (val !== "monthly") setRecurrencyDay(0);
                            }}
                        >
                            <option value="none">Uma vez</option>
                            <option value="daily">Diária</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensal</option>
                        </select>
                    </div>

                    {periodicity === "monthly" && (
                        <div className="flex flex-col gap-1.5 w-1/2 animate-fadeIn">
                            <Label className="whitespace-nowrap">Dia do mês</Label>
                            <Input 
                                type="number" 
                                step="1" 
                                min="1" 
                                max="31" 
                                required 
                                value={recurrencyDay || ""} 
                                onChange={(e) => setRecurrencyDay(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <div className={`flex flex-col gap-1.5 w-full transition-all`}>
                        <Label>Categoria</Label>
                        <select 
                            className="w-full disabled:bg-gray-200 dark:disabled:bg-zinc-800 bg-gray-100 dark:bg-zinc-700 p-3 rounded-xl dark:text-white border-none text-sm outline-none cursor-pointer"
                            value={categoryId}
                            onChange={(e) => {setCategoryId(e.target.value)}}
                            disabled={!!category}
                        >
                            {category ? (
                                <option value={category.id}>{category.name}</option>
                            ) : (
                                categories?.map(categoryUnique => (
                                    <option key={categoryUnique.id} value={categoryUnique.id}>{categoryUnique.name}</option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                <div className="flex gap-2 pt-4">
                    <Button variants="standard" colors="secondary" type="button" onClick={onClose} className="flex-1">
                        Cancelar
                    </Button>
                    <Button variants="standard" colors="primary" type="submit" className="flex-1">
                        Salvar
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TransactionCategoryModal;