import { ChartNoAxesCombined } from "lucide-react";
import Button from "../../../components/button";
import Modal from "../../../components/modal";

interface InfoPlanningSectionProps {
    onClose: () => void
}

const InfoPlanningSectionModal = ({ onClose }: InfoPlanningSectionProps) => {
    return (
        <Modal>
            <div className="flex items-center gap-3 mb-4 text-primary">
                <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-xl text-amber-600 dark:text-amber-400">
                    <ChartNoAxesCombined size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">O que é a seção Planejamento?</h3>
            </div>
            
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                    Esta seção é o coração da sua organização financeira. Aqui você consegue seu <strong>saldo estimado</strong>, mapeando <strong>receitas</strong> e distribuindo suas <strong>despesas</strong> por categorias.
                </p>
                
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 block text-xs uppercase tracking-wider">Como funciona ?</span>
                    <p>Você pode criar <strong>transações programadas</strong> (contas recorrentes ou parceladas) para que o sistema automatize e preveja o seu fluxo de caixa dos próximos meses.</p>
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                    <p><strong>Dica:</strong> Mantenha suas despesas categorizadas para entender exatamente para onde seu dinheiro está indo e onde é possível economizar. </p>
                </div>
            </div>

            <Button variants="standard" colors="primary" onClick={onClose} className="mt-6 w-full text-sm">
                Entendi, fechar
            </Button>
        </Modal>
    );
};

export default InfoPlanningSectionModal;