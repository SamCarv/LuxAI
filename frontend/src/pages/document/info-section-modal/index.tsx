import { HelpCircle } from "lucide-react";
import Button from "../../../components/button";
import Modal from "../../../components/modal";

interface InfoDocumentSectionModalProps {
    onClose: () => void
}

const InfoDocumentSectionModal = ({ onClose }: InfoDocumentSectionModalProps ) => {
    return (
        <Modal>
            <div className="flex items-center gap-3 mb-4 text-primary">
                <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-xl text-amber-600 dark:text-amber-400">
                    <HelpCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">O que é a seção Arquivos ?</h3>
            </div>
            
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                    Esta seção permite que você envie documentos para o seu <strong>assistente pessoal</strong>. Quanto mais contexto ele tiver, mais assertivas serão as análises e sua organização financeira.
                </p>
                
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 block text-xs uppercase tracking-wider">Formatos Suportados</span>
                    <p>São aceitos apenas arquivos de <strong>Imagem (.png, .jpg)</strong> ou <strong>PDF</strong> (ex: extratos bancários, comprovantes, notas fiscais).</p>
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                    <p><strong>Importante:</strong> Seus dados são criptografados, processados de forma isolada e nunca compartilhados com terceiros.</p>
                </div>
            </div>

            <Button variants="standard" colors="primary" onClick={onClose} className="mt-6 w-full text-sm">
                Entendi, fechar
            </Button>
        </Modal>
    );
};

export default InfoDocumentSectionModal; 