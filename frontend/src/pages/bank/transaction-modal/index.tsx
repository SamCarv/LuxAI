import { useState } from "react";
import type { PeriodicityType, StatusTransactionType, Transaction, TransactionType } from "../../../types/transaction";

interface TransactionModalProps {
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  categories: { id: number; name: string }[];
  wallets: { id: number, name: string, lastTransaction: string, amountCurrency: string, amountValue: number }[];
}

const TransactionModal = ({ onClose, onSave, categories, wallets }: TransactionModalProps) => {
  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // Data de hoje por padrão
  const [status, setStatus] = useState<StatusTransactionType>("pending");
  const [periodicity, setPeriodicity] = useState<PeriodicityType>("once");
  const [accountId, setAccountId] = useState<number>(wallets[0]?.id || 0);
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 0);

  const resetForm = () => {
    setType("expense");
    setDescription("");
    setAmount(0);
    setDate(new Date().toISOString().split('T')[0]);
    setStatus("pending");
    setPeriodicity("once");
    setAccountId(wallets[0]?.id || 0);
    setCategoryId(categories[0]?.id || 0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      description,
      amount: Number(amount),
      date,
      type,
      status,
      periodicity,
      category_id: Number(accountId),
      account_id: Number(categoryId)
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-xl animate-in fade-in zoom-in-95 my-auto">
        <h2 className="text-xl font-bold dark:text-white mb-4">
          Nova Transação
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">

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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Salário, Gasolina..." 
              className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl dark:text-white outline-none" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 w-1/2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor</label>
              <input 
                type="number" 
                step="0.01"
                required
                placeholder="R$ 0,00" 
                className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl dark:text-white outline-none" 
                value={amount || ""}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </div>

            <div className="flex flex-col gap-1.5 w-1/2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
              <input 
                type="date" 
                required
                className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl dark:text-white outline-none text-sm cursor-pointer" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 w-1/2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conta</label>
              <select 
                className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl dark:text-white border-none text-sm outline-none cursor-pointer"
                value={accountId}
                onChange={(e) => setAccountId(Number(e.target.value))}
              >
                {wallets.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 w-1/2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
              <select 
                className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl dark:text-white border-none text-sm outline-none cursor-pointer"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 w-1/2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Frequência</label>
              <select 
                className="w-full bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl dark:text-white border-none text-sm outline-none cursor-pointer"
                value={periodicity}
                onChange={(e) => setPeriodicity(e.target.value as PeriodicityType)}
              >
                <option value="once">Uma vez</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="annually">Anual</option>
              </select>
            </div>

          </div>

          <div className="flex gap-2 pt-4">
            <button 
              type="button"
              onClick={handleClose} 
              className="flex-1 py-3 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors cursor-pointer"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;