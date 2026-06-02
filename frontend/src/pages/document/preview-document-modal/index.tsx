import Button from "../../../components/button"
import Modal from "../../../components/modal"
import type { Document } from "../../../types/document"

interface PreviewDocumentModalProps {
    previewFile: Document
    onClose: () => void
}

const PreviewDocumentModal = ({previewFile, onClose}: PreviewDocumentModalProps) => {
    return (
        <Modal>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50">{previewFile.title}</h3>
                    <p className="text-xs text-gray-500">{previewFile.filename}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-700 rounded-md uppercase font-semibold">
                    {previewFile.content_type.split('/')[1] || previewFile.content_type}
                </span>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-h-60 overflow-y-auto mb-6">
                <pre className="text-xs font-mono whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                    {previewFile.text || "Nenhum conteúdo de texto extraído deste arquivo."}
                </pre>
            </div>

            <div className="flex justify-end">
                <Button onClick={onClose} variants="standard" colors="primary" className="text-sm py-2 px-5">
                    Fechar Preview
                </Button>
            </div>
        </Modal>
    )
}

export default PreviewDocumentModal