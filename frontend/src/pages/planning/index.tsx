import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeftRight, Home, Plus, X, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";

import PanelItem from "../../components/panel/panel.item";
import PanelItemIcon from "../../components/panel/panel.icon";
import { PanelItemInfo, PanelItemInfoDetail, PanelItemInfoTitle } from "../../components/panel/panel.info";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { ChartContainer } from "../../components/ui/chart";
import { categories } from "../../utils/constants.planning";

import CreateCategoryModal from "./create-category-modal";
import { DynamicIcon, type IconName } from "./dynamic-icon";
import { deleteCategory } from "./functions/delete-category";

import { chartConfig, PERIODS, VIEWS } from "./constants";
import { type ActiveView, type TimePeriod } from "./types";
import { usePlanningCharts } from "./use-planning-charts";
import { PlanningChartRender } from "./planning-chart-render";

const Planning = () => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<ActiveView>('expense');
  const [isComparing, setIsComparing] = useState(false);
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  const chartDataBundled = usePlanningCharts(activeView, isComparing);

  return (
    <section className="flex flex-col w-full h-full gap-y-6 max-w-7xl mx-auto p-4 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('planning')}</h1>

        <div className="flex items-center gap-2 bg-smoke-100 dark:bg-zinc-800 p-1 rounded-xl border border-slate-200 dark:border-zinc-700 w-full sm:w-auto overflow-x-auto no-scrollbar shadow-inner">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                period === p.id 
                  ? "bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-600" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {p.id === 'custom' && <Calendar size={13}/>}
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-smoke-100 dark:bg-zinc-800 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">

        <div className="grid grid-cols-3 lg:flex lg:flex-col gap-2.5 w-full">
          {VIEWS.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 p-3 sm:p-4 rounded-xl transition-all ring-2 cursor-pointer text-center sm:text-left ${
                activeView === view.id 
                  ? " bg-white dark:bg-zinc-800 shadow-sm text-candy-corn-600 dark:text-candy-corn-300 ring-candy-corn-400 dark:ring-candy-corn-300" 
                  : "ring-smoke-300 dark:ring-zinc-700 hover:ring-smoke-400 dark:hover:ring-zinc-500 bg-transparent hover:bg-white/60 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className={`w-2.5 h-2.5 shrink-0 rounded-full ${view.color} shadow-sm`} />
              <span className="text-xs sm:text-sm font-semibold truncate w-full">{view.label}</span>
            </button>
          ))}
          
          <hr className="hidden lg:block my-1.5 border-slate-200 dark:border-slate-800" />

          <button 
            onClick={() => setIsComparing(!isComparing)}
            className={`col-span-3 lg:col-span-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
              isComparing 
                ? "bg-candy-corn-400  text-black border-black shadow-sm shadow-primary/20" 
                : "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary dark:hover:border-primary hover:text-primary"
            }`}
          >
            <ArrowLeftRight size={16} />
            <span className="text-xs sm:text-sm font-bold">{isComparing ? "Modo Comparação" : "Comparar Períodos"}</span>
          </button>
        </div>

        <Card className="lg:col-span-3 bg-white dark:bg-zinc-700/40 border border-slate-200 dark:border-slate-800/80 shadow-sm backdrop-blur-sm">
          <CardHeader className="pb-0 items-center lg:items-start text-center lg:text-left px-4 pt-4 sm:px-6 sm:pt-6">
            <CardTitle className="text-lg sm:text-xl font-bold">
              {activeView === 'profit' ? 'Análise de Lucro' : `Distribuição de ${VIEWS.find(v => v.id === activeView)?.label}`}
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              {isComparing ? "Comparando com o período de tempo anterior" : "Visualização do período selecionado"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex items-center justify-center p-4 sm:p-6 max-h-70 sm:min-h-80">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-70 sm:max-w-80">
              <PlanningChartRender activeView={activeView} isComparing={isComparing} {...chartDataBundled} />
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-y-4 mt-2">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-bold tracking-tight opacity-85">{t('Minhas Despesas')}</h2>
          <span className="text-sm font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-lg">Total: R$ 7.600,00</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <PanelItem key={category.id} className="w-full ">
              <NavLink className="flex w-full items-center min-w-0" to={category.id.toString()}>
                <PanelItemIcon style={{ backgroundColor: `#${category.color}`}} className="group-hover:brightness-110 transition shadow-md shrink-0">
                  {category ? <DynamicIcon name={category.icon as IconName} /> : <Home />}
                </PanelItemIcon>
                <PanelItemInfo className="flex-1 lg:ml-3 truncate">
                  <PanelItemInfoTitle className="font-semibold text-slate-800 dark:text-slate-200 truncate">{category.name}</PanelItemInfoTitle>
                  <PanelItemInfoDetail className="text-slate-500 dark:text-slate-400 font-medium">R$ 1900.00</PanelItemInfoDetail>
                </PanelItemInfo>
              </NavLink>
              <button 
                onClick={() => deleteCategory(category)} 
                className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors shrink-0 ml-2 cursor-pointer"
              >
                <X size={16}/>
              </button>
            </PanelItem>
          ))}
          
          <button 
            onClick={() => setCategoryModalOpen(true)}
            className="flex items-center justify-center h-18 rounded-md border-2 border-slate-300 dark:border-slate-700 hover:border-candy-corn-600 hover:text-candy-corn-600 dark:hover:border-candy-corn-300 dark:hover:text-candy-corn-300 bg-slate-50/50 dark:bg-slate-900/20 text-slate-400 transition-all cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {isCategoryModalOpen && <CreateCategoryModal onClose={() => setCategoryModalOpen(false)}/>}
    </section>
  );
};

export default Planning;