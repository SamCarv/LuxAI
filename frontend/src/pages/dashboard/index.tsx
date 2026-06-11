import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, TrendingUp, Sparkles, FileText, DollarSign, Target, Calendar, AlertCircle, KeyRound, Eye, MessageSquare, ChevronRight, Copy } from 'lucide-react';
import Button from '../../components/button';
import { get_analyze } from '../../services/dashboar';
import ReactMarkdown from 'react-markdown';
import CreateGoalModal from '../goal/create-goal-modal';
import CreateCategoryModal from '../planning/create-category-modal';
import type { CreateGoal } from '../../types/goals';
import { create_goal } from '../../services/goal';
import type { CreateCategory } from '../../types/category';
import { create_category, list_categories } from '../../services/category';
import { UploadModal } from '../document/upload-documet-modal';
import type { CreateDocument } from '../../types/document';
import { upload_document } from '../../services/document';
import TransactionCategoryModal from '../planning/create-transaction-modal';

const Dashboard = () => {
  const [hasApiKey, setHasApiKey] = useState(() => {return localStorage.getItem('luxai_api_key_configured') === 'true';});
  const [isVisibleReport, setIsVisibleReport] = useState(false)
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: list_categories });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['financialReports', hasApiKey],
    queryFn: () => get_analyze(),
    enabled: isVisibleReport 
  });

  const configureKeySetup = () => {
    localStorage.setItem('luxai_api_key_configured', 'true');
    setHasApiKey(true);
    setIsVisibleReport(true);
  };

  const goToChat = () => {
    const promptMessage = `Olá! Acabei de ver o relatório de IA de ${report?.month}/${report?.year} no meu Dashboard. Com base na análise que diz "${report?.analysis}", quais são as melhores sugestões e planos de ação práticos que posso tomar?`;

    navigate('/chat', { 
      state: { 
        autoSendMessage: promptMessage 
      } 
    });
  };

  const createGoalMutation = useMutation({
    mutationFn: (newGoal: CreateGoal) => create_goal(newGoal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setIsGoalModalOpen(false)
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: (newCategory: CreateCategory) => create_category(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCategoryModalOpen(false);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (createDocument: CreateDocument) => upload_document(createDocument),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  return (
    <section className="max-w-7xl p-4 md:p-6 w-full mx-auto min-h-screen">
      <div className="text-zinc-800 dark:text-zinc-100 space-y-6">
        <div className="flex justify-between items-end">
          <h1 className="heading-lg">Dashboard</h1>
        </div>

        <section className="w-full bg-linear-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="p-3 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 rounded-xl shrink-0">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm md:text-base">Não sabe por onde começar a se organizar?</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
                Fale com o nosso assistente pessoal <span className="font-semibold text-yellow-600 dark:text-yellow-400">LuxAI</span>! Ele está pronto para te dar dicas personalizadas e te orientar no uso de todo o sistema.
              </p>
            </div>
          </div>
          <Button variants="standard" colors="primary" onClick={() => navigate('/chat')} className="flex items-center justify-center gap-2">
            <span>Conversar com Assistente Pessoal</span>
            <ChevronRight className='size-5 stroke-4 md:stroke-3' />
          </Button>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
              <PlusCircle className=' size-6 text-yellow-500 dark:text-yellow-400' />
              Ações Rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <button onClick={() => setIsCategoryModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-yellow-400/10 dark:hover:bg-yellow-400/10 border border-zinc-200 dark:border-zinc-800 hover:border-yellow-400 rounded-xl transition-all group cursor-pointer">
                  <DollarSign className="text-zinc-600 dark:text-zinc-400 mb-2 group-hover:scale-110 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-all" size={24} />
                  <span className="font-medium text-sm">Criar Categoria</span>
                </button>

                <button onClick={() => setIsTransactionModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-yellow-400/10 dark:hover:bg-yellow-400/10  border border-zinc-200 dark:border-zinc-800 hover:border-yellow-400 rounded-xl transition-all group cursor-pointer">
                  <Calendar className="text-zinc-600 dark:text-zinc-400 mb-2 group-hover:scale-110 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-all" size={24} />
                  <span className="font-medium text-sm">Criar Transação</span>
                </button>

                <button onClick={() => setIsGoalModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-yellow-400/10 dark:hover:bg-yellow-400/10  border border-zinc-200 dark:border-zinc-800 hover:border-yellow-400 rounded-xl transition-all group sm:col-span-2 md:col-span-1 cursor-pointer">
                  <Target className="text-zinc-600 dark:text-zinc-400 mb-2 group-hover:scale-110 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-all" size={24} />
                  <span className="font-medium text-sm">Definir Meta</span>
                </button>
              </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
              <TrendingUp className=' size-6 text-yellow-500 dark:text-yellow-400' />
              Dados de Entrada
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Envie extrato financeiro para reforçar a assertividade do seu assistente pessoal.
            </p>
            <button onClick={() => setIsDocumentModalOpen(true)} className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 cursor-pointer hover:bg-yellow-400/5 dark:hover:bg-yellow-400/10 group transition-colors">
               <div className="flex items-center gap-3">
                  <FileText size={20} className="text-zinc-400 group-hover:text-yellow-400" />
                  <span className="text-xs font-medium">Suporta PDF e Imagens</span>
               </div>
            </button>
          </section>
        </div>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-400 rounded-lg text-white">
                <Eye size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Perspectiva de Melhoria</h2>
                <p className="text-xs text-zinc-500 font-medium">Análise gerada pela LuxAI baseada no seu comportamento</p>
              </div>
            </div>
            
            {report && (
              <span className="text-xs font-bold px-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-full">
                {report.month}/{report.year}
              </span>
            )}
          </div>

          <div className="p-8 flex flex-col flex-1 items-center">
            {!hasApiKey ? (
              <div className="bg-zinc-50 w-full max-w-lg dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 space-y-5 my-auto">
                <div className="p-3 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                  <KeyRound size={22} />
                </div>
                
                <div className="space-y-2 text-center">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Conecte sua Inteligência Artificial</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Para habilitar os módulos analíticos e os relatórios de diagnóstico, insira sua própria chave de acesso do <strong className="text-zinc-800 dark:text-zinc-200">Google Gemini</strong>.
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] space-y-2 text-zinc-600 dark:text-zinc-400">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">Passo a passo para configurar:</p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-1">
                    <li>Acesse o site do <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer" className="text-yellow-600 dark:text-yellow-400 underline font-medium">Google AI Studio</a>(Caso seja rediricionado, faça a confirmação de idade).</li>
                    <li>Na parte lateral inferior, clique em <span className="font-medium text-zinc-900 dark:text-white">"Get API Key"</span> e copie a sua chave clicando no ícone de copiar <Copy size={8} className="inline-block ml-1 align-middle"/></li>
                    <li>Aqui na nossa plataforma, vá até a <span className="font-medium text-zinc-900 dark:text-white">Sidebar (barra lateral esquerda inferior)</span>.</li>
                    <li>Na parte inferior, procure pelo seu <span className="font-medium text-zinc-900 dark:text-white">Nome de Usuário</span> e clique nele.</li>
                    <li>No painel que se abrir, acesse a seção <span className="font-medium text-zinc-900 dark:text-white">"IA"</span>.</li>
                    <li>Selecione o provedor <span className="font-semibold">Gemini</span> e cole a chave copiada.</li>
                  </ol>
                </div>

                <Button variants='standard' colors='primary' onClick={configureKeySetup} className="w-full text-xs font-semibold">
                  Entendi, já configurei
                </Button>
              </div>
            ) : isLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-zinc-500 animate-pulse font-medium">A LuxAI está processando seus números...</p>
              </div>
            ) : isError ? (
              <div className="py-12 text-center text-red-500 space-y-3">
                <AlertCircle size={32} className="mx-auto" />
                <p className="text-sm font-medium">Houve um erro na comunicação com a API ou sua chave é inválida.</p>
                <Button onClick={() => {setHasApiKey(false); localStorage.setItem('luxai_api_key_configured', 'false');}} variants='standard' colors='secondary'>
                  Voltar e configurar chave novamente
                </Button>
              </div>
            ) : (
              isVisibleReport ? (
                <div className="max-w-4xl animate-fade-in space-y-8">
                  <div className="prose dark:prose-invert prose-zinc max-w-none">
                    <div className="flex items-start gap-4">
                        <Sparkles className="text-yellow-500 shrink-0 mt-1" size={20} />
                        <div className="space-y-4">
                          <div className="text-base md:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-medium">
                            <ReactMarkdown>
                              {report?.analysis}
                            </ReactMarkdown>  
                          </div>
                        </div>
                    </div>
                  </div>

                  <div className="bg-linear-to-r from-zinc-50 to-white dark:from-zinc-800/50 dark:to-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm">
                        <MessageSquare size={20} className="text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Deseja agir sobre essa análise?</p>
                        <p className="text-xs text-zinc-500">Inicie um chat para traçar planos de ação específicos.</p>
                      </div>
                    </div>
                    <Button 
                      variants='standard' 
                      colors='primary'
                      onClick={goToChat}
                      className="flex items-center gap-2 px-6 py-2.5 group shadow-lg shadow-yellow-500/10"
                    >
                      <span>Abrir Consultoria</span>
                      <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </div>
                </div>
              ): (
                <>
                  <p className='mb-4'>Você está conectado com o seu Assistente Pessoal.</p>
                  <Button onClick={() => setIsVisibleReport(true)} variants='standard' colors='primary'>
                    Quero minha Análise
                  </Button>
                </>
              )
            )}
          </div>
        </section>
      </div>
      
      {isCategoryModalOpen && <CreateCategoryModal createCategory={createCategoryMutation.mutate} onClose={() => setIsCategoryModalOpen(false)}/>}
      {isTransactionModalOpen && <TransactionCategoryModal onClose={() => setIsTransactionModalOpen(false)} categories={categories}/>}
      {isGoalModalOpen && <CreateGoalModal onSave={createGoalMutation.mutate} onClose={() => setIsGoalModalOpen(false)}/>}
      {isDocumentModalOpen && <UploadModal onUpload={uploadMutation.mutate} onClose={() => setIsDocumentModalOpen(false)} />}
    </section>
  );
};

export default Dashboard;