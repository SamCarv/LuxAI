import { useState } from 'react';
import { X } from 'lucide-react';
import type { GoalView, UpdateGoal } from '../../../types/goals';
import Button from '../../../components/button';
import Input from '../../../components/input';
import Label from '../../../components/label';
import Modal from '../../../components/modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { update_goal_balance } from '../../../services/goal';

interface GoalDetailsModalProps {
  goal: GoalView;
  onClose: () => void;
}

const GoalDetailsModal = ({ goal, onClose }: GoalDetailsModalProps) => {
    const queryClient = useQueryClient();

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const [name, setName] = useState(goal.name);
    const [targetAmount, setTargetAmount] = useState(goal.target_amount.toString());
    const [currentAmount, setCurrentAmount] = useState(goal.current_amount.toString());
    const [deadline, setDeadline] = useState(formatDateForInput(goal.deadline));

    const { mutate, isPending } = useMutation({
        mutationFn: (updatedData: UpdateGoal) => update_goal_balance(goal.id, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !targetAmount || !currentAmount || !deadline) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const updatedGoal: UpdateGoal = {
            name,
            target_amount: Number(targetAmount),
            current_amount: Number(currentAmount),
            deadline: new Date(deadline).toISOString()
        };

        mutate(updatedGoal);
    };

    return (
        <Modal>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Editar Meta</h2>
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                    <X size={18}/>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="goal-name">Nome da Meta</Label>
                    <Input id="goal-name" required type="text" placeholder="Ex: Reserva de Emergência, Viagem..." value={name} onChange={e => setName(e.target.value)}/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="current-amount">Saldo Acumulado (R$)</Label>
                        <Input id="current-amount" required type="number" step="0.01" placeholder="0,00" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="target-amount">Objetivo Final (R$)</Label>
                        <Input id="target-amount" required type="number" step="0.01"placeholder="0,00" value={targetAmount} onChange={e => setTargetAmount(e.target.value)}/>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="deadline">Previsão para Conclusão</Label>
                    <Input id="deadline"required type="date" value={deadline} onChange={e => setDeadline(e.target.value)}/>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <Button type="button" onClick={onClose} variants="standard" colors="secondary"disabled={isPending}>
                        Fechar
                    </Button>
                    <Button type="submit" variants="standard" colors="primary"disabled={isPending}>
                        {isPending ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default GoalDetailsModal;