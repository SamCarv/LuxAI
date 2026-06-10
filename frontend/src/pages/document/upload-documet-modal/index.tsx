import { useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/modal";
import Input from "../../../components/input";
import Button from "../../../components/button";
import type { CreateDocument } from "../../../types/document";
import Label from "../../../components/label";
import { Loader2 } from "lucide-react";

interface UploadModalProps {
  onClose: () => void;
  onUpload: (createDocument: CreateDocument) => void;
  isPending: boolean;
}

export const UploadModal: FC<UploadModalProps> = ({
  onClose,
  onUpload,
  isPending,
}) => {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onUpload({ title, file: selectedFile });
    }
  };

  return (
    <Modal>
      <h2 className="text-xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">
        Upload de Documento
      </h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>
            Título do Documento
          </Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Extrato de Março"
            disabled={isPending}
          />
        </div>

        <div>
          <Label>
            Selecionar Arquivo (pdf, jpg, png)
          </Label>
          <input
            type="file"
            accept="image/*, application/pdf"
            required
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            disabled={isPending}
            className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-600 hover:file:bg-yellow-100 disabled:opacity-50"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
          <Button
            variants="standard"
            colors="secondary"
            type="button"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </Button>

          <Button
            variants="standard"
            colors="primary"
            type="submit"
            disabled={isPending || !selectedFile}
            className="flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin size-4" />
                <span>Enviando...</span>
              </>
            ) : (
              <span>Enviar</span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
