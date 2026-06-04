import { useState } from "react";
import { Home, Plus, HelpCircle, Loader2, FileText, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import Panel from "../../components/panel";
import PanelItem from "../../components/panel/panel.item";
import PanelItemIcon from "../../components/panel/panel.icon";
import { PanelItemInfo, PanelItemInfoDetail, PanelItemInfoTitle } from "../../components/panel/panel.info";
import CreateCategoryModal from "./create-category-modal";
import { DynamicIcon, type IconName } from "./dynamic-icon";
import Button from "../../components/button";
import Input from "../../components/input";
import InfoPlanningSectionModal from "./info-section-modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create_category, delete_category, list_categories } from "../../services/category";
import type { CreateCategory } from "../../types/category";
import { sumBalanceCategory } from "./functions/sum_category";

const Planning = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('');
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isInfoPlanningModalOpen, setInfoPlanningModalOpen] = useState(false);
  
  const { error: categoriesError, isLoading: isCategoriesLoading, data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: list_categories });

  const createCategoryMutation = useMutation({
    mutationFn: (newCategory: CreateCategory) => create_category(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setCategoryModalOpen(false);
    },
    onError: (error) => {
      console.error("Erro ao criar categoria:", error);

    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => delete_category(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error("Erro ao deletar categoria:", error);
      alert("Não foi possível deletar a categoria. Verifique se ela possui transações vinculadas.");
    }
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="flex flex-col w-full h-full gap-y-6 max-w-7xl mx-auto p-4 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button onClick={() => setInfoPlanningModalOpen(true)} variants='ghost' colors='no_color' className="relative group flex flex-row items-center gap-4 before:absolute before:bottom-0 before:left-0 before:h-1 before:w-0 before:bg-current hover:before:w-full before:transition-all before:duration-300 before:ease-in-out" title='Saber mais sobre essa seção'>
          <h1 className="heading-lg tracking-tight group-hover:text-gray-500 dark:group-hover:text-gray-300">Planejamento de Despesas e Receitas</h1>
          <HelpCircle className='fill-white size-10 sm:size-min group-hover:fill-slate-200 stroke-gray-600 duration-100 ease-in'/>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div className="w-full md:max-w-xs">
          <Input 
            type="text" 
            placeholder="Pesquisar categorias" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className='w-full'
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            onClick={() => setCategoryModalOpen(true)}
            variants="standard"
            colors="primary"
            className="text-sm py-3 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 min-w-35"
          >
            <Plus size={18} strokeWidth={2.4}/> 
            <span>Nova Categoria</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-y-4 mt-2">
        {categories.length > 0 && <p className="text-lg font-bold  py-1 rounded-lg">Total de saldo planejado para o próximo mês: <span className="text-red-500">R$ 7.600,00</span></p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {isCategoriesLoading && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-zinc-500">
              <Loader2 className="animate-spin h-10 w-10 text-zinc-400 mb-4" />
              <p className="text-sm font-medium">Carregando categorias...</p>
            </div>
          )}

          {!isCategoriesLoading && categoriesError && (
            <Panel className='col-span-full items-center justify-center text-center py-16 px-4 mx-auto'>
              <p className="text-base font-semibold text-rose-500 mb-1">Não foi possível carregar as categorias</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Tente atualizar a página mais tarde.
              </p>
            </Panel>
          )}

          {!isCategoriesLoading && !categoriesError && categories.length === 0 && (
            <Panel className='col-span-full items-center justify-center text-center py-16 px-4 mx-auto'>
              <div className="p-4 bg-white dark:bg-zinc-700 shadow-sm rounded-2xl text-zinc-400 dark:text-zinc-400 mb-4 inline-block mx-auto">
                <FileText className='size-10' strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Crie sua primeira categoria</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
                Organize seu planejamento criando categorias personalizadas para gerenciar suas despesas.
              </p>
              <Button 
                onClick={() => setCategoryModalOpen(true)}
                variants="standard"
                colors="primary"
                className="text-sm flex items-center gap-2 px-5 mx-auto"
              >
                <Plus size={16} />
                <span>Nova Categoria</span>
              </Button>
            </Panel>
          )}

          {!isCategoriesLoading && !categoriesError && categories.length > 0 && (
            filteredCategories.length === 0 ? (
              <p className="col-span-full text-center text-sm text-zinc-500 py-12">
                Nenhuma categoria encontrada para a sua busca
              </p>
            ) : (
              filteredCategories.map((category) => (
                <PanelItem key={category.id} className="w-full">
                  <NavLink className="flex w-full items-center min-w-0" to={category.id}>
                    <PanelItemIcon style={{ backgroundColor: `#${category.color}`}} className="group-hover:brightness-110 transition shadow-md shrink-0">
                      {category.icon ? <DynamicIcon name={category.icon as IconName} /> : <Home />}
                    </PanelItemIcon>
                    <PanelItemInfo className="flex-1 lg:ml-3 truncate">
                      <PanelItemInfoTitle className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {category.name}
                      </PanelItemInfoTitle>
                      <PanelItemInfoDetail className="text-slate-500 dark:text-slate-400 font-medium">
                        R$ {sumBalanceCategory(category.transactions)}
                      </PanelItemInfoDetail>
                    </PanelItemInfo>
                  </NavLink>
                  <button 
                    onClick={() => deleteCategoryMutation.mutate(category.id)} 
                    className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors shrink-0 ml-2 cursor-pointer"
                  >
                    <X size={16}/>
                  </button>
                </PanelItem>
              ))
            )
          )}
        </div>
      </div>

      {isCategoryModalOpen && <CreateCategoryModal onClose={() => setCategoryModalOpen(false)} createCategory={createCategoryMutation.mutate}/>}
      {isInfoPlanningModalOpen && <InfoPlanningSectionModal onClose={() => setInfoPlanningModalOpen(false)} />}
    </section>
  );
};

export default Planning;