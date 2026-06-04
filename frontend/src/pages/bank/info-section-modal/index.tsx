import { CreditCard, Landmark } from "lucide-react";
import Button from "../../../components/button";
import Modal from "../../../components/modal";

interface InfoBankSectionProps {
    onClose: () => void
}

const InfoBankSectionModal = ({ onClose }: InfoBankSectionProps) => {
    return (
        <Modal>
            <div className="flex items-center gap-3 mb-4 text-primary">
                <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-xl text-amber-600 dark:text-amber-400">
                    <CreditCard size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">O que é a seção Banco?</h3>
            </div>
            
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                    Aqui você gerencia a sua realidade financeira atual. É o espaço para consolidar o saldo de suas <strong>contas bancárias</strong> (corrente, poupança ou dinheiro em espécie) e acompanhar a movimentação real do seu dinheiro.
                </p>
                
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 block text-xs uppercase tracking-wider">Histórico de Transações</span>
                    <p>Você pode filtrar, buscar e auditar entradas e saídas passadas para garantir que tudo esteja correto.</p>
                </div>
            </div>

            <Button variants="standard" colors="primary" onClick={onClose} className="mt-6 w-full text-sm">
                Entendi, fechar
            </Button>
        </Modal>
    );
};

export default InfoBankSectionModal;