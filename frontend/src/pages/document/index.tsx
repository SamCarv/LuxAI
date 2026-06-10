import { useState } from "react";
import { UploadModal } from "./upload-documet-modal";
import { FileCard } from "./file-card";
import type { CreateDocument, Document } from "../../types/document";
import { FileText, HelpCircle, Loader2, Plus } from "lucide-react";
import Button from "../../components/button";
import Input from "../../components/input";
import PreviewDocumentModal from "./preview-document-modal";
import Panel from "../../components/panel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  delete_documents,
  list_documents,
  upload_document,
} from "../../services/document";
import InfoDocumentSectionModal from "./info-section-modal";

export const Files = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<Document | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const {
    isPending: documentsLoading,
    error: documentsError,
    data: documents = [],
  } = useQuery({ queryKey: ["documents"], queryFn: list_documents });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => delete_documents(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setSelectedIds([]);
      setIsSelectionMode(false);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (createDocument: CreateDocument) =>
      upload_document(createDocument),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setIsUploadOpen(false);
    },
    onError: (err) => {
      console.error("Erro ao subir arquivo:", err);
      alert("Falha ao enviar o arquivo. Verifique o console.");
    },
  });

  const openSelectedFile = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const deleteSelectedFiles = () => {
    if (
      confirm(
        `Deseja realmente deletar os ${selectedIds.length} arquivos selecionados?`,
      )
    ) {
      deleteMutation.mutate(selectedIds);
    }
  };

  const uploadFile = (createDocument: CreateDocument) => {
    uploadMutation.mutate(createDocument);
  };

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="flex flex-col w-full h-full gap-y-6 max-w-7xl mx-auto p-4 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <header onClick={() => setIsInfoModalOpen(true)} className='cursor-pointer group' title='Saber mais sobre essa seção'>
        <Button variants='ghost' colors='no_color' className="relative flex flex-row items-center gap-4  before:absolute before:bottom-0 before:left-0 before:h-1 before:w-0 before:bg-current group-hover:before:w-full before:transition-all before:duration-300 before:ease-in-out">
          <h1 className="heading-lg tracking-tight group-hover:text-gray-500 dark:group-hover:text-gray-300">Arquivos</h1>
          <HelpCircle className='fill-white group-hover:fill-slate-200 stroke-gray-600 group-hover:gray-400 duration-100 ease-in'/>
        </Button>
        <p className='group-hover:text-gray-500 dark:group-hover:text-gray-400'>Essa seção possibilita inserir dados financeiros. Saber mais...</p>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6 bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div className="w-full md:max-w-xs">
          <Input
            type="text"
            placeholder="Pesquisar arquivos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button
            onClick={() => setIsUploadOpen(true)}
            variants="standard"
            colors="primary"
            className="text-sm py-3 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 min-w-35"
          >
            <Plus size={18} strokeWidth={2.4} />
            <span>Enviar Arquivo</span>
          </Button>

          <Button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedIds([]);
            }}
            variants="standard"
            colors="secondary"
            className={`text-sm py-3 flex-1 sm:flex-initial text-center justify-center ${
              isSelectionMode
                ? "bg-zinc-300 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                : ""
            }`}
          >
            {isSelectionMode ? "Cancelar" : "Selecionar para Deletar"}
          </Button>

          {isSelectionMode && selectedIds.length > 0 && (
            <button
              onClick={deleteSelectedFiles}
              className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors animate-in fade-in w-full sm:w-auto mt-2 sm:mt-0 cursor-pointer"
            >
              Deletar ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {documentsLoading && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-zinc-500">
            <Loader2 className="animate-spin h-10 w-10 text-zinc-400 mb-4" />
            <p className="text-sm font-medium">Carregando seus documentos...</p>
          </div>
        )}

        {!documentsLoading && documentsError && (
          <Panel className="col-span-full items-center justify-center text-center py-16 px-4 mx-auto">
            <p className="text-base font-semibold text-rose-500 mb-1">
              Não foi possível carregar os arquivos
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Tente atualizar a página mais tarde.
            </p>
          </Panel>
        )}

        {!documentsLoading && !documentsError && documents.length === 0 && (
          <Panel className="col-span-full items-center justify-center text-center py-16 px-4 mx-auto">
            <div className="p-4 bg-white dark:bg-zinc-700 shadow-sm rounded-2xl text-zinc-400 dark:text-zinc-400 mb-4">
              <FileText className="size-10" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Adicione seu primeiro documento
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm">
              Envie extratos bancários em PDF ou imagens de comprovantes para
              reforçar a assertividade e o contexto do seu assistente pessoal.
            </p>
            <Button
              onClick={() => setIsUploadOpen(true)}
              variants="standard"
              colors="primary"
              className="text-sm flex items-center gap-2 px-5"
            >
              <Plus size={16} />
              <span>Enviar Arquivo</span>
            </Button>
          </Panel>
        )}
        {!documentsLoading &&
          !documentsError &&
          documents.length > 0 &&
          (filteredDocs.length === 0 ? (
            <p className="col-span-full text-center text-sm text-zinc-500 py-12">
              Nenhum arquivo encontrado para a sua busca
            </p>
          ) : (
            filteredDocs.map((doc) => (
              <FileCard
                key={doc.id}
                file={doc}
                isSelectionMode={isSelectionMode}
                isSelected={selectedIds.includes(doc.id)}
                onToggleSelect={openSelectedFile}
                onPreview={(file) => setPreviewFile(file)}
              />
            ))
          ))}
      </div>

      {isUploadOpen && (
        <UploadModal
          onClose={() => setIsUploadOpen(false)}
          onUpload={uploadFile}
          isPending={uploadMutation.isPending}
        />
      )}
      {isInfoModalOpen && (
        <InfoDocumentSectionModal onClose={() => setIsInfoModalOpen(false)} />
      )}
      {previewFile && (
        <PreviewDocumentModal
          previewFile={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </section>
  );
};
