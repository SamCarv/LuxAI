import { Flag, Target } from "lucide-react";
import Button from "../../../components/button";
import Modal from "../../../components/modal";

interface InfoGoalsSectionProps {
    onClose: () => void
}

const InfoGoalsSectionModal = ({ onClose }: InfoGoalsSectionProps) => {
    return (
        <Modal>
            <div className="flex items-center gap-3 mb-4 text-primary">
                <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-xl text-amber-600 dark:text-amber-400">
                    <Flag size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">O que é a seção Metas?</h3>
            </div>
            
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                    A seção de Metas serve para você tirar os seus sonhos do papel e transformá-los em <strong>objetivos financeiros claros</strong>. Seja para criar sua reserva de emergência, fazer uma viagem ou comprar algo especial.
                </p>
                
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 block text-xs uppercase tracking-wider">Como funciona ?</span>
                    <p>Defina o valor total do seu objetivo, estipule um prazo e acompanhe a <strong>barra de progresso</strong> conforme você envia dinheiro para essa meta mensalmente.</p>
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                    <p><strong>Importante:</strong> O dinheiro enviado para uma meta ajuda você a não gastar por impulso o que deveria ser poupado.</p>
                </div>
            </div>

            <Button variants="standard" colors="primary" onClick={onClose} className="mt-6 w-full text-sm">
                Entendi, fechar
            </Button>
        </Modal>
    );
};

export default InfoGoalsSectionModal;