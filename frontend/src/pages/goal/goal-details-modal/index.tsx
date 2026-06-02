import { useState } from 'react';
import { X, ArrowDownRight } from 'lucide-react';
import type { Goal } from '../../../types/goals';
import type { AccountView } from '../../../types/account';
import Button from '../../../components/button';
import Input from '../../../components/input';
import { useQuery } from '@tanstack/react-query';
import { get_bank_accounts } from '../../../services/account';
import Modal from '../../../components/modal';

interface GoalDetailsModalProps {
  goal: Goal;
  onClose: () => void;
  onWithdraw: (amount: number, accountId: string) => void;
}

const GoalDetailsModal = ({ goal, onClose, onWithdraw }: GoalDetailsModalProps) => {
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const {data: accounts} = useQuery({queryKey: ["accounts"], queryFn: get_bank_accounts})

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const handleConfirmWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = Number(withdrawAmount);

        if (!amount || amount <= 0 || !selectedAccount) return;
        if (amount > goal.currentAmount) {
            alert("O valor informado para retirada é maior do que o saldo atual da meta.");
            return;
        }

        if (confirm(`Tem certeza de que deseja retirar ${formatCurrency(amount)} desta meta?`)) {
            onWithdraw(amount, selectedAccount);
        }
    };

    return (
        <Modal>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">{isWithdrawing ? 'Configurar Retirada' : 'Detalhes da Meta'}</h2>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"><X size={18}/></button>
            </div>

            {!isWithdrawing ? (
                <div className="space-y-5">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl space-y-3">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tema</p>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{goal.name}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-zinc-400 block mb-0.5">Saldo Acumulado</span>
                            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(goal.currentAmount)}</span>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-400 block mb-0.5">Objetivo Final</span>
                            <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200">{formatCurrency(goal.targetAmount)}</span>
                        </div>
                    </div>

                    <div>
                        <span className="text-xs text-zinc-400 block mb-1">Previsão para Conclusão</span>
                        <p className="text-sm font-medium">{new Date(goal.deadline).toLocaleDateString('pt-BR')}</p>
                    </div>

                    <div className="flex gap-2 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Button onClick={onClose} variants="standard" colors="secondary">Fechar</Button>
                        <Button onClick={() => setIsWithdrawing(true)} variants="standard" colors="primary"
                            className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5"
                            disabled={goal.currentAmount <= 0}
                        >
                            <ArrowDownRight size={16}/>
                            Retirar Valor
                        </Button>
                    </div>
                </div>
                ) : (
                <form onSubmit={handleConfirmWithdraw} className="space-y-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-xs rounded-xl font-medium">
                        Você está resgatando fundos guardados. O saldo da sua meta diminuirá.
                    </div>

                    <div>
                        <label className="text-xs font-semibold mb-1 block">Quanto deseja retirar? (Máx: {formatCurrency(goal.currentAmount)})</label>
                        <Input required type="number" step="0.01" max={goal.currentAmount}placeholder="0,00" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}/>
                    </div>

                    <div>
                    <label className="text-xs font-semibold mb-1 block">Conta de Destino (Receber o Valor)</label>
                    <select
                        required
                        value={selectedAccount}
                        onChange={e => setSelectedAccount(e.target.value)}
                        className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Selecione a conta...</option>
                        {accounts? accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        )):
                            <p>Nenhuma conta encontrada</p>
                        }
                    </select>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <Button type="button" onClick={() => setIsWithdrawing(false)} variants="standard" colors="secondary">Voltar</Button>
                    <Button 
                        type="submit" 
                        variants="standard" 
                        colors="primary"
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        Confirmar Resgate
                    </Button>
                </div>
            </form>
            )}
        </Modal>
    );
};

export default GoalDetailsModal;