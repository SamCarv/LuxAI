import { Target, Calendar } from 'lucide-react';
import type { Goal } from '../../types/goals';

interface GoalCardProps {
  goal: Goal;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onClick: () => void;
}

const GoalCard = ({ goal, isSelectionMode, isSelected, onToggleSelect, onClick }: GoalCardProps) => {
    const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div 
            onClick={() => isSelectionMode ? onToggleSelect(goal.id) : onClick()}
            className={`p-5 bg-white dark:bg-zinc-800 rounded-2xl border transition-all cursor-pointer relative group ${
                isSelected 
                ? 'border-red-500 ring-2 ring-red-500/20' 
                : 'border-zinc-100 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
        >
            {isSelectionMode && (
                <div className="absolute top-4 right-4">
                    <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => onToggleSelect(goal.id)}
                        className="rounded text-red-500 focus:ring-red-500 size-4 cursor-pointer"
                    />
                </div>
            )}

            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-primary-50 dark:bg-primary-950/30 text-primary-500 rounded-xl">
                    <Target size={20} />
                </div>
                <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-45">{goal.name}</h4>
                    <span className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} /> Alvo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-zinc-500">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span>{percent.toFixed(0)}% de {formatCurrency(goal.targetAmount)}</span>
                </div>
                
                <div className="w-full bg-zinc-100 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                    <div 
                        className="bg-primary-500 h-full transition-all duration-500" 
                        style={{ width: `${percent}%` }} 
                    />
                </div>
            </div>
        </div>
    );
};

export default GoalCard