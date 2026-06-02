import { useState } from 'react';
import { X } from 'lucide-react';
import type { CreateGoal } from '../../../types/goals';
import Input from '../../../components/input';
import Button from '../../../components/button';

interface CreateGoalModalProps {
  onClose: () => void;
  onSave: (createGoal: CreateGoal) => void;
}

const CreateGoalModal = ({ onClose, onSave }: CreateGoalModalProps) => {
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [initialAmount, setInitialAmount] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !targetAmount || !deadline) return;

        onSave({
            name:'',

        targetAmount: Number(targetAmount),
        initialAmount: Number(initialAmount || 0),
        deadline,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-6 border border-zinc-100 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Criar Nova Meta</h2>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"><X size={18}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold mb-1 block">Nome do Tema / Meta</label>
                        <Input required type="text" placeholder="Viagem de Férias, Carro Novo..." value={title} onChange={e => setTitle(e.target.value)}/>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold mb-1 block">Capital Inicial (R$)</label>
                            <Input type="number" step="0.01" placeholder="0,00" value={initialAmount} onChange={e => setInitialAmount(e.target.value)}/>
                        </div>
                        <div>
                            <label className="text-xs font-semibold mb-1 block">Valor Alvo (R$)</label>
                            <Input required type="number" step="0.01" placeholder="1.000,00" value={targetAmount} onChange={e => setTargetAmount(e.target.value)}/>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold mb-1 block">Previsão / Data Limite</label>
                        <Input required type="date" value={deadline} onChange={e => setDeadline(e.target.value)}/>
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button type="button" onClick={onClose} variants="standard" colors="secondary">Cancelar</Button>
                        <Button type="submit" variants="standard" colors="primary">Salvar Meta</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGoalModal;