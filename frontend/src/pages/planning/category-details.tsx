import { useState, useMemo } from 'react';
import { ChevronLeft, Trash2, Plus, Calendar, CheckCircle2, Clock, Search, Filter, CreditCard, BarChart2, GitCompare, Edit3 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import type {  CreateTransaction, TransactionView, UpdateTransaction } from '../../types/transaction';
import Button from '../../components/button';
import TransactionCategoryModal from './create-transaction-modal';
import { DynamicIcon, type IconName } from './dynamic-icon';
import ButtonIcon from '../../components/button/icon';
import ButtonLabel from '../../components/button/text';
import { sumBalanceCategory } from './functions/sum_category';
import { get_one_category, update_category } from '../../services/category';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Panel from '../../components/panel';
import { format } from 'date-fns/format';
import { ptBR } from 'date-fns/locale/pt-BR';
import type { UpdateCategory } from '../../types/category';
import CreateCategoryModal from './create-category-modal';
import { create_transaction, update_transaction } from '../../services/transaction';

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionView | null>(null);
  const { data: category } = useQuery({queryKey: ['category', id], queryFn: () => get_one_category(id!), enabled: !!id,});

  const filteredTransactions = useMemo(() => {
    if (!category) return [];
    return category.transactions.filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [category, searchTerm]);

  const handleOpenEdit = (transaction: TransactionView) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updateCategory }: { id: string; updateCategory: UpdateCategory }) => update_category(id, updateCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', id]})
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar categoria:", error);
    }
  });

  const createTransactionMutation = useMutation({
    mutationFn: (createTransaction: CreateTransaction) => create_transaction(createTransaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', id]})
      queryClient.invalidateQueries({ queryKey: ['categories']})
    }
  })

  const updateTransactionMutation = useMutation({
    mutationFn: ({id, updateTransaction}: {id: string, updateTransaction: UpdateTransaction}) => update_transaction(id, updateTransaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', id]})
      queryClient.invalidateQueries({ queryKey: ['categories']})
    }
  })

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-150 gap-6 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="w-full lg:w-1/3 flex flex-col space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-paris-daisy-600 dark:hover:text-paris-daisy-400 transition-colors w-fit cursor-pointer">
          <ChevronLeft size={24} />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="flex items-center gap-4 mt-4">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
            {category && <DynamicIcon style={{ color: `#${category?.color}` }} name={category?.icon as IconName} />}
          </div>
          <div>
            <h2 className="text-sm text-gray-500 uppercase tracking-wider">Categoria</h2>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{category?.name}</h1>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-gray-500 font-medium">Total</p>
            <p className="text-xl font-bold text-yellow-500">R$ {sumBalanceCategory(category?.transactions)}/mês</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 min-h-37.5">
          <h3 className="text-gray-400 text-sm mb-2 uppercase font-semibold">Descrição</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{category?.description || `Nenhuma descrição definida para esta categoria. Toque em editar para adicionar informações sobre seus gastos em ${category?.name}`}</p>
        </div>

        <div className="flex justify-around items-center pt-4">
          <Button variants='ghost' colors='no_color'> 
            <ButtonIcon><BarChart2/></ButtonIcon>
            <ButtonLabel>Gráfico</ButtonLabel>
          </Button>
          <Button variants='ghost' colors='no_color'> 
            <ButtonIcon><GitCompare/></ButtonIcon>
            <ButtonLabel>Comparação</ButtonLabel>
          </Button>
          <Button onClick={() => setIsCategoryModalOpen(true)} variants='ghost' colors='no_color'> 
            <ButtonIcon><Edit3/></ButtonIcon>
            <ButtonLabel>Editar</ButtonLabel>
          </Button>
        </div>
      </div>

      <div className="w-full lg:w-2/3 h-full max-h-180 bg-gray-50 dark:bg-zinc-900/50 rounded-[40px] p-6 border border-gray-200 dark:border-zinc-800 relative flex flex-col">
        <div className="flex flex-col space-y-4 mb-6 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
                  <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
               </div>
               <h3 className="font-bold text-lg text-gray-800 dark:text-zinc-100">Transações</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variants='circle' colors='primary' onClick={handleOpenCreate}>
                <Plus size={20} strokeWidth={3} />
              </Button>
              <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors rounded-full cursor-pointer">
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Pesquisar..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border-none rounded-xl text-sm dark:text-white shadow-sm outline-paris-daisy-400 dark:outline-paris-daisy-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700">
              <Filter size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-full pr-2 scrollbar">
          {category?.transactions.length === 0 && 
            <Panel className='col-span-full items-center justify-center text-center py-16 px-4 mx-auto'>
              <div className="p-4 bg-white dark:bg-zinc-700 shadow-sm rounded-2xl text-zinc-400 dark:text-zinc-400 mb-4 inline-block mx-auto">
                <CreditCard className='size-10' strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Crie sua transação programada</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
                Planeje as suas transações com relação a esta categoria de despesa. Isso manterá seu controle nos gastos.
              </p>
              <Button 
                onClick={handleOpenCreate}
                variants="standard"
                colors="primary"
                className="text-sm flex items-center gap-2 px-5 mx-auto"
              >
                <Plus size={16} />
                <span>Nova Transação</span>
              </Button>
            </Panel>
          }

          {category && category.transactions.length > 0 && filteredTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              onClick={() => handleOpenEdit(transaction)}
              className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-transparent hover:border-yellow-500/50 transition-all shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${transaction.status === 'success' ? 'bg-green-100 text-green-500' : 'bg-yellow-100 text-yellow-500'}`}>
                  {transaction.status === 'success' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{transaction.description}</h4>
                  <div className="flex gap-2 text-[10px] uppercase font-bold text-gray-400">
                    <span>{format(transaction.date, "dd MMM. yyyy", { locale: ptBR })}</span>
                    <span>•</span>
                    <span className="text-yellow-600">{transaction.recurrence_frequency === 'none' ? 'Uma vez' : transaction.recurrence_frequency === 'daily' ?  'Diária' : transaction.recurrence_frequency === 'weekly' ?  'Semanal' : transaction.recurrence_frequency === 'monthly' &&  'Mensal'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">R$ {transaction.amount}</p>
                  <span className={`text-[10px] uppercase font-bold text-gray-400 ${transaction.status === 'success' ? 'text-green-500' : ' text-yellow-500'}`}>Status: {transaction.status}</span>
                </div>
                <div className="w-2 h-10 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden flex flex-col justify-end">
                    <div className="w-full h-full bg-yellow-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isCategoryModalOpen && <CreateCategoryModal onClose={() => setIsCategoryModalOpen(false)} category={category} updateCategory={updateCategoryMutation.mutate} />}
      {isTransactionModalOpen &&  <TransactionCategoryModal category={category} createTransaction={createTransactionMutation.mutate} updateTransaction={updateTransactionMutation.mutate} selectedTransaction={selectedTransaction} onClose={() => setIsTransactionModalOpen(false)}/>}
    </div>
  );
};

export default CategoryDetail;