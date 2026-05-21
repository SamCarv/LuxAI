import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, BarChart2, GitCompare, Edit3, Trash2, Plus, 
  Calendar, CheckCircle2, Clock, Search, Filter, 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../../utils/constants.planning';
import type { Transaction } from '../../types/transaction';
import Button from '../../components/button';
import TransactionCategoryModal from './category-details-modal';
import { DynamicIcon, type IconName } from './dynamic-icon';
import ButtonIcon from '../../components/button/icon';
import ButtonLabel from '../../components/button/text';
import { DetailCategoryOptions } from './constants';

const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const category = categories.find(c => c.id === Number(id));

  const filteredTransactions = useMemo(() => {
    if (!category) return [];
    return category.transactions.filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [category, searchTerm]);

  const totalMonthly = category?.transactions.reduce((acc, tr) => acc + tr.amount, 0);

  const handleOpenEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-150 gap-6 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="w-full lg:w-1/3 flex flex-col space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-paris-daisy-600 dark:hover:text-paris-daisy-400 transition-colors w-fit cursor-pointer">
          <ChevronLeft size={24} />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="flex items-center gap-4 mt-4">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
            <DynamicIcon style={{ color: `#${category?.color}` }} name={category?.icon as IconName} />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 uppercase tracking-wider">Categoria</h2>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{category?.name}</h1>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-gray-500 font-medium">Total</p>
            <p className="text-xl font-bold text-yellow-500">R$ {totalMonthly?.toFixed(2)}/mês</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 min-h-37.5">
          <h3 className="text-gray-400 text-sm mb-2 uppercase font-semibold">Descrição</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{category?.description || `Nenhuma descrição definida para esta categoria. Toque em editar para adicionar informações sobre seus gastos em ${category?.name}`}</p>
        </div>

        <div className="flex justify-around items-center pt-4">
          {DetailCategoryOptions.map( options => (
            <Button variants='ghost' colors='no_color'> 
              <ButtonIcon><options.icon size={20}/></ButtonIcon>
              <ButtonLabel>{options.label}</ButtonLabel>
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-2/3 bg-gray-50 dark:bg-zinc-900/50 rounded-[40px] p-6 border border-gray-200 dark:border-zinc-800 relative">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
                  <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
               </div>
               <h3 className="font-bold text-lg text-gray-800 dark:text-zinc-100">Pagamentos</h3>
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

        <div className="space-y-3 overflow-y-auto max-h-112.5 pr-2 custom-scrollbar">
          {filteredTransactions.map((t) => (
            <div 
              key={t.id}
              onClick={() => handleOpenEdit(t)}
              className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-transparent hover:border-yellow-500/50 transition-all shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${t.status === 'successful' ? 'bg-green-100 text-green-500' : 'bg-yellow-100 text-yellow-500'}`}>
                  {t.status === 'successful' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{t.description}</h4>
                  <div className="flex gap-2 text-[10px] uppercase font-bold text-gray-400">
                    <span>{t.date}</span>
                    <span>•</span>
                    <span className="text-yellow-600">{t.periodicity === 'monthly' ? 'Mensal' : t.periodicity}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">R$ {t.amount.toFixed(2)}</p>
                  <span className={`text-[10px] uppercase font-bold text-gray-400 ${t.status === 'successful' ? 'text-green-500' : ' text-yellow-500'}`}>Status: {t.status}</span>
                </div>
                <div className="w-2 h-10 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden flex flex-col justify-end">
                    <div className="w-full h-1/2 bg-yellow-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedTransaction && <TransactionCategoryModal selectedTransaction={selectedTransaction} onClose={() => setIsModalOpen(false)}/>}
    </div>
  );
};

export default CategoryDetail;