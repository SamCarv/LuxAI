import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import Modal from "../../../components/modal";
import Input from "../../../components/input";
import Button from "../../../components/button";
import type { CreateDocument } from "../../../types/document";

interface UploadModalProps {
  onClose: () => void;
  onUpload: (createDocument: CreateDocument) => void;
}

export const UploadModal: FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      console.log(selectedFile)
      onUpload({title, file: selectedFile});
      setTitle('');
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <Modal>
      <h2 className="text-xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">Upload de Documento</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Título do Documento</label>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Extrato de Março"/>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Selecionar Arquivo (pdf, jpg, png)</label>
          <input type="file" accept="image/*, application/pdf" required onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-600 hover:file:bg-yellow-100"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
          <Button variants="standard" colors="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variants="standard" colors="primary" type="submit">
            Enviar
          </Button>
        </div>
      </form>
    </Modal>
  );
};