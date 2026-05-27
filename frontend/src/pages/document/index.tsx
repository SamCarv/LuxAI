import { useEffect, useState } from 'react';
import { UploadModal } from './upload-documet-modal';
import { FileCard } from './file-card';
import type { Document } from '../../types/documen';
import { documentsData } from './constant';
import { Plus } from 'lucide-react';
import Button from '../../components/button';
import Input from '../../components/input';
import PreviewDocumentModal from './preview-document-modal';

export const Files = () => {
  const [documents, setDocuments] = useState<Document[]>(documentsData);
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<Document | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectFile = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (confirm(`Deseja realmente deletar os ${selectedIds.length} arquivos selecionados?`)) {
      setDocuments(prev => prev.filter(doc => !selectedIds.includes(doc.id)));
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };

  const handleUploadFile = (title: string, file: File) => {
    const newDoc: Document = {
      id: Math.random().toString(),
      user_id: 'u1',
      title,
      filename: file.name,
      content_type: file.type,
      storage_path: '',
      text: `Conteúdo de texto bruto processado a partir do arquivo enviado: ${file.name}`,
      created_at: new Date().toISOString()
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  const filteredDocs = documents.filter(doc => 
    doc.filename.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    
  }, [documents])

  return (
    <div className="p-6 w-full max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Arquivos</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6 bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div className="w-full md:max-w-xs">
          <Input type="text" placeholder="Pesquisar arquivos" value={search} onChange={(e) => setSearch(e.target.value)} className='w-full'/>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button 
            onClick={() => setIsUploadOpen(true)}
            variants="standard"
            colors="primary"
            className="text-sm py-3 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 min-w-35"
          >
            <Plus size={18} strokeWidth={2.4}/> 
            <span>Adicionar</span>
          </Button>

          <Button 
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedIds([]);
            }}
            variants="standard"
            colors="secondary"
            className={`text-sm py-3 flex-1 sm:flex-initial text-center justify-center ${
              isSelectionMode ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100' : ''
            }`}
          >
            {isSelectionMode ? 'Cancelar' : 'Selecionar para Deletar' }
          </Button>

          {isSelectionMode && selectedIds.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors animate-in fade-in w-full sm:w-auto mt-2 sm:mt-0 cursor-pointer"
            >
              Deletar ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredDocs.length === 0 ? (
          <p className="col-span-full text-center text-sm text-zinc-500 py-12">Nenhum arquivo encontrado</p>
        ) : (
          filteredDocs.map((doc) => (
            <FileCard 
              key={doc.id} 
              file={doc} 
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.includes(doc.id)}
              onToggleSelect={toggleSelectFile}
              onPreview={(file) => setPreviewFile(file)}
            />
          ))
        )}
      </div>

      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} onUpload={handleUploadFile}/>}
        
      {previewFile && <PreviewDocumentModal previewFile={previewFile} onClose={() => setPreviewFile(null)} />}
    </div>
  );
};