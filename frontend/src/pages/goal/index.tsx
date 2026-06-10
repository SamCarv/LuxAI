import { useState } from 'react';
import { Plus, PiggyBank, Loader2, HelpCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/button';
import Input from '../../components/input';
import Panel from '../../components/panel';
import { list_goals, create_goal, update_goal_balance, delete_goals } from '../../services/goal';
import type { CreateGoal, GoalView, UpdateGoal } from '../../types/goals';
import GoalCard from './goal-card';
import CreateGoalModal from './create-goal-modal';
import GoalDetailsModal from './goal-details-modal';
import InfoGoalsSectionModal from './info-section-modal';

export const Goals = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalView | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const { data: goals = [], isLoading, error } = useQuery({ 
    queryKey: ['goals'], 
    queryFn: list_goals 
  });

  const createGoalMutation = useMutation({
    mutationFn: (newGoal: CreateGoal) => create_goal(newGoal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setIsCreateOpen(false);
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (ids: string[]) => delete_goals(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, updateGoal }: { id: string; updateGoal: UpdateGoal }) => 
      update_goal_balance(id, updateGoal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setSelectedGoal(null);
    }
  });

  const toggleSelectGoal = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const deleteSelectedGoal = () => {
    if (confirm(`Deseja realmente deletar as ${selectedIds.length} metas selecionadas?`)) {
      deleteGoalMutation.mutate(selectedIds);
    }
  };

  const filteredGoals = goals.filter(goal => 
    goal.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="flex flex-col w-full h-full gap-y-6 max-w-7xl mx-auto p-4 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <header onClick={() => setIsGoalModalOpen(true)} className='cursor-pointer group' title='Saber mais sobre essa seção'>
        <Button variants='ghost' colors='no_color' className="relative flex flex-row items-center gap-4  before:absolute before:bottom-0 before:left-0 before:h-1 before:w-0 before:bg-current group-hover:before:w-full before:transition-all before:duration-300 before:ease-in-out">
          <h1 className="heading-lg tracking-tight group-hover:text-gray-500 dark:group-hover:text-gray-300">Metas</h1>
          <HelpCircle className='fill-white group-hover:fill-slate-200 stroke-gray-600 duration-100 ease-in'/>
        </Button>
        <p className='group-hover:text-gray-500 dark:group-hover:text-gray-400'>Essa seção serve para você tirar os seus sonhos do papel e transformá-los em objetivos financeiros claros. Saber mais...</p>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6 bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div className="w-full md:max-w-xs">
          <Input 
            type="text" 
            placeholder="Pesquisar metas" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className='w-full'
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button 
            onClick={() => setIsCreateOpen(true)} 
            variants="standard" 
            colors="primary"
            className="text-sm py-3 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 min-w-35"
          >
            <Plus size={18} strokeWidth={2.4}/> 
            <span>Criar Meta</span>
          </Button>

          <Button 
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedIds([]);
            }}
            variants="standard"
            colors="secondary"
            className={`text-sm py-3 flex-1 sm:flex-initial text-center justify-center ${
              isSelectionMode ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100' : ''
            }`}
          >
            {isSelectionMode ? 'Cancelar' : 'Selecionar para Deletar' }
          </Button>

          {isSelectionMode && selectedIds.length > 0 && (
            <button 
              onClick={deleteSelectedGoal}
              className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors animate-in fade-in w-full sm:w-auto cursor-pointer"
            >
              Deletar ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-zinc-500">
            <Loader2 className="animate-spin h-10 w-10 text-zinc-400 mb-4" />
            <p className="text-sm font-medium">Carregando suas metas...</p>
          </div>
        )}

        {!isLoading && error && (
          <Panel className='col-span-full items-center justify-center text-center py-16 px-4 mx-auto'>
            <p className="text-base font-semibold text-rose-500 mb-1">Não foi possível carregar os arquivos</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Tente atualizar a página mais tarde.
            </p>
          </Panel>
        )}

        {!isLoading && !error && goals.length === 0 && (
          <Panel className="col-span-full items-center justify-center text-center py-16 px-4 mx-auto">
            <div className="p-4 bg-white dark:bg-zinc-700 shadow-sm rounded-2xl text-zinc-400 dark:text-zinc-400 mb-4">
              <PiggyBank className='size-10' strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg">Nenhuma meta definida</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm">Estabeleça seus motivos de guardar dinheiro numa meta. Seja para fazer uma viagem ou comprar algo especial.</p>
            <Button onClick={() => setIsCreateOpen(true)} variants="standard" colors="primary" className='text-sm flex items-center gap-2 px-5'>
              <Plus size={16} />
              Criar Meta
            </Button>
          </Panel>
        )}

        {!isLoading && !error && goals.length > 0 && (
          filteredGoals.length === 0 ? (
            <p className="col-span-full text-center text-sm text-zinc-500 py-12">Nenhuma meta encontrada para a sua busca</p>
          ) : (
            filteredGoals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                isSelectionMode={isSelectionMode}
                isSelected={selectedIds.includes(goal.id)}
                onToggleSelect={toggleSelectGoal}
                onClick={() => !isSelectionMode && setSelectedGoal(goal)} 
              />
            ))
          )
        )}
      </div>

      {isCreateOpen && (
        <CreateGoalModal 
          onClose={() => setIsCreateOpen(false)} 
          onSave={(data) => createGoalMutation.mutate(data)}
        />
      )}

      {selectedGoal && (
        <GoalDetailsModal 
          goal={selectedGoal} 
          onClose={() => setSelectedGoal(null)}
        />
      )}

      {isGoalModalOpen && <InfoGoalsSectionModal onClose={() => setIsGoalModalOpen(false)} /> }
    </section>
  );
};

export default Goals;