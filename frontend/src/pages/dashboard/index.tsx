import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  PlusCircle, 
  TrendingUp, 
  Sparkles, 
  FileText, 
  DollarSign, 
  Target, 
  Calendar,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Eye,
  Award,
  TrendingDown
} from 'lucide-react';
import Button from '../../components/button';


interface Report {
  period: string;
  summary: string;
  suggestions: string[];
}

const fetchFinancialReports = async (hasKey: boolean): Promise<Report[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  if (!hasKey) return [];

  return [
    {
      period: 'Maio 2026',
      summary: 'Sua saúde financeira está estável, mas detectamos um aumento de 15% em gastos supérfluos no fim de semana. Seu comprometimento com a meta "Reserva de Emergência" atingiu 80%.',
      suggestions: [
        'Reduzir despesas com delivery nos próximos 15 dias.',
        'Alocar R$ 200,00 extras na meta de Reserva aproveitando o bônus recebido.',
        'Automatizar o lembrete da fatura do cartão X para evitar juros.'
      ]
    }
  ];
};

export default function Dashboard() {
  const [hasApiKey, setHasApiKey] = useState(false); 
  const queryClient = useQueryClient();

  const { data: reports, isLoading, isError, refetch } = useQuery<Report[]>({
    queryKey: ['financialReports', hasApiKey],
    queryFn: () => fetchFinancialReports(hasApiKey),
  });

  const generateReportMutation = useMutation({
    mutationFn: async () => {
      if (!hasApiKey) throw new Error("Chave ausente");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { id: Date.now().toString(), period: 'Atualizado Agora', status: 'ready', summary: 'IA analisou seus dados recentes: Tudo pronto para o próximo mês!', suggestions: [] };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialReports'] });
    },
  });

  const handleSuggestionClick = (prompt: string) => {
    alert(`Redirecionando para a seção de Chat com o comando:\n\n"${prompt}"`);
  };

  return (
    <div className="max-w-400 transition-colors duration-300">
      <div className="text-zinc-800 dark:text-zinc-100 min-h-screen p-4 md:p-8 font-sans transition-colors duration-300">
        <div className="mb-6">
            <h1 className="heading-lg">
              Dashboard
            </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PlusCircle size={20} className="text-yellow-500" />
                Acesso rápido
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <button className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-yellow-400/10 border border-zinc-200 dark:border-zinc-800 hover:border-yellow-400 rounded-xl transition-all group">
                  <DollarSign className="text-zinc-600 dark:text-zinc-400 mb-2 group-hover:scale-110 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-all" size={24} />
                  <span className="font-medium text-sm">Registrar Receita</span>
                </button>

                <button className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-yellow-400/10 border border-zinc-200 dark:border-zinc-800 hover:border-yellow-400 rounded-xl transition-all group">
                  <Calendar className="text-zinc-600 dark:text-zinc-400 mb-2 group-hover:scale-110 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-all" size={24} />
                  <span className="font-medium text-sm">Criar Pagamento</span>
                </button>

                <button className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-yellow-400/10 border border-zinc-200 dark:border-zinc-800 hover:border-yellow-400 rounded-xl transition-all group sm:col-span-2 md:col-span-1">
                  <Target className="text-zinc-600 dark:text-zinc-400 mb-2 group-hover:scale-110 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-all" size={24} />
                  <span className="font-medium text-sm">Definir Meta</span>
                </button>
              </div>
            </section>

            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <TrendingUp size={20} className="text-yellow-500" />
                Alimentar Inteligência Artificial
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                Como não coletamos dados automáticos de contas, importe seus extratos (PDF ou Imagens) para calibrar as decisões da IA.
              </p>
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-yellow-400 rounded-xl p-8 text-center cursor-pointer transition-colors bg-zinc-50/50 dark:bg-zinc-800/20">
                <div className="flex flex-col items-center">
                  <span className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full mb-3">
                    <FileText size={24} />
                  </span>
                  <p className="text-sm font-medium">Arraste seu extrato bancário ou clique para upload</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Suporta PDF e Imagens</p>
                </div>
              </div>
            </section>

            <section className="bg-linear-to-br from-yellow-50 via-amber-50 to-transparent dark:from-yellow-400/10 dark:via-zinc-900 p-6 rounded-2xl shadow-sm border border-yellow-400/20 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="text-yellow-600 dark:text-yellow-400" size={22} />
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Melhoria de Decisões</h2>
                </div>
              </div>
              
              {!hasApiKey ? (
                <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center space-y-2">
                  <Sparkles size={20} className="text-zinc-400 mx-auto" />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                    Sua evolução estratégica aparecerá aqui. Assim que sua chave API for configurada, o motor LuxAI começará a pontuar os acertos e melhorias de decisões baseadas no seu fluxo manual.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg text-green-600 dark:text-green-400 shrink-0">
                      <TrendingDown size={18} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        Otimização de Custos e Consistência Semanais
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        **No que você melhorou:** Identificamos uma redução consistente de **12% nas despesas supérfluas** de final de semana ao longo dos últimos registros e uma frequência estável no preenchimento do painel.
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        **Por que isso importa:** Reduzir desperdícios repetitivos protege seu orçamento contra endividamentos sazonais e dá a tração matemática que você precisa para alcançar a meta de "Reserva de Emergência" até 2 meses antes do previsto.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                      Próximo passo sugerido pelo consultor: Estruturar o balanceamento desse montante economizado para acelerar suas metas de médio prazo.
                    </p>
                    <Button variants='standard' colors='primary'
                      onClick={() => handleSuggestionClick("Minhas decisões de custos melhoraram e economizei com despesas supérfluas. Qual a melhor estratégia para realocar esse saldo de forma inteligente nas minhas metas ou investimentos futuros?")}
                      className="whitespace-nowrap flex items-center justify-center gap-1.5 font-medium text-xs py-2 px-3.5 group"
                    >
                      <span>Continuar conversa</span>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-1">
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Eye size={20} className="text-yellow-500" />
                  Perspectiva de melhoria
                </h2>
                {hasApiKey && (
                  <Button variants='standard' colors='primary' 
                    onClick={() => generateReportMutation.mutate()}
                    disabled={generateReportMutation.isPending}
                    className="text-xs font-medium px-3 py-1.5"
                  >
                    {generateReportMutation.isPending ? 'Analisando...' : 'Atualizar'}
                  </Button>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                {isLoading && (
                  <div className="py-12 text-center space-y-3 flex-1 flex flex-col justify-center items-center">
                    <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Buscando configurações da LuxAI...</p>
                  </div>
                )}

                {isError && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-center space-y-2">
                    <AlertCircle className="mx-auto text-red-500" size={24} />
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">Erro ao carregar os relatórios.</p>
                    <button onClick={() => refetch()} className="text-xs text-red-600 dark:text-red-400 underline">Tentar novamente</button>
                  </div>
                )}

                {!isLoading && !isError && !hasApiKey && (
                  <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 space-y-5 my-auto">
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
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200">📋 Passo a passo para configurar:</p>
                      <ol className="list-decimal list-inside space-y-1.5 pl-1">
                        <li>Acesse o site do <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-yellow-600 dark:text-yellow-400 underline font-medium">Google AI Studio</a> e crie uma chave API gratuita.</li>
                        <li>Aqui na nossa plataforma, vá até a <span className="font-medium text-zinc-900 dark:text-white">Sidebar (barra lateral esquerda)</span>.</li>
                        <li>Na parte inferior, procure pelo seu <span className="font-medium text-zinc-900 dark:text-white">Nome de Usuário</span> e clique nele.</li>
                        <li>No painel/modal que se abrir, acesse a seção <span className="font-medium text-zinc-900 dark:text-white">"IA"</span>.</li>
                        <li>Selecione o provedor <span className="font-semibold">Gemini</span> e cole a chave copiada.</li>
                      </ol>
                    </div>

                    <Button variants='standard' colors='primary' onClick={() => setHasApiKey(true)} className="w-full text-xs font-semibold">
                      Entendi, já configurei
                    </Button>
                  </div>
                )}

                {!isLoading && !isError && hasApiKey && reports && reports.length > 0 && (
                  <div className="space-y-4 animate-fade-in">
                    {reports.map((report) => (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 px-2.5 py-1 rounded-full text-zinc-600 dark:text-zinc-300">
                            {report.period}
                          </span>
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                            Análise Ativa
                          </span>
                        </div>

                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800">
                          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                            "{report.summary}"
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Ações Recomendadas (Clique para iniciar)
                          </h4>
                          <div className="space-y-2">
                            {report.suggestions.map((suggestion, index) => (
                              <button 
                                key={index}
                                onClick={() => handleSuggestionClick(`Gostaria de executar a seguinte recomendação da IA: "${suggestion}"`)}
                                className="w-full text-left text-xs bg-white dark:bg-zinc-800 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-yellow-400 shadow-sm flex items-start gap-2 transition-all group"
                              >
                                <span className="text-yellow-500 font-bold group-hover:scale-120 transition-transform">•</span>
                                <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">{suggestion}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-4 text-xs text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1">
                  <Sparkles size={12} />
                  Algoritmo LuxAI calibrado conforme seus inputs manuais.
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}