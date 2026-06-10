import { Target, Calendar } from 'lucide-react';
import type { GoalView } from '../../types/goals';

interface GoalCardProps {
  goal: GoalView;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onClick: () => void;
}

const GoalCard = ({ goal, isSelectionMode, isSelected, onToggleSelect, onClick }: GoalCardProps) => {
    const percent = Math.min((goal.current_amount / goal.target_amount) * 100, 100);

    return (
        <div 
            onClick={() => isSelectionMode ? onToggleSelect(goal.id) : onClick()}
            className={`p-5 bg-white dark:bg-zinc-800 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                isSelected 
                ? 'border-red-500 ring-2 ring-red-500/20' 
                : 'border-gray-400 dark:border-zinc-700 hover:border-yellow-500 dark:hover:border-yellow-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
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
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 truncate max-w-45">{goal.name}</h4>
                    <span className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} /> Meta: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-zinc-400">
                    <span>R$ {Number(goal.current_amount).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span>{percent.toFixed(0)}% de R$ {Number(goal.target_amount).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                <div className="w-full bg-zinc-100 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                    <div 
                        className="bg-yellow-500 dark:bg-yellow-400 h-full transition-all duration-500" 
                        style={{ width: `${percent}%` }} 
                    />
                </div>
            </div>
        </div>
    );
};

export default GoalCard