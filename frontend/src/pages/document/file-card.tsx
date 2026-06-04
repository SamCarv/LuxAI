import { type FC } from 'react';
import type { Document } from '../../types/document';
import { FileText, FileSpreadsheet, FileJson, File } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FileCardProps {
  file: Document;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onPreview: (file: Document) => void;
}

export const FileCard: FC<FileCardProps> = ({ file, isSelectionMode, isSelected, onToggleSelect, onPreview }) => {
  const fileExtension = file.filename.split('.').pop()?.toUpperCase() || 'FILE';

  let IconComponent = File;
  let badgeColor = 'bg-red-500';
  let textColor = 'text-red-500';
  let iconBg = 'bg-red-50 dark:bg-red-950/20';

  if (['CSV', 'XLSX', 'XLS'].includes(fileExtension)) {
    IconComponent = FileSpreadsheet;
    badgeColor = 'bg-emerald-500';
    textColor = 'text-emerald-600 dark:text-emerald-400';
    iconBg = 'bg-emerald-50 dark:bg-emerald-950/20';
  } else if (fileExtension === 'JSON') {
    IconComponent = FileJson;
    badgeColor = 'bg-orange-500';
    textColor = 'text-orange-500';
    iconBg = 'bg-orange-50 dark:bg-orange-950/20';
  } else if (fileExtension === 'PDF') {
    IconComponent = FileText;
    textColor = 'text-red-500';
    badgeColor = 'bg-red-500';
    iconBg = 'bg-red-50 dark:bg-red-950/20';
  }

  const handleClick = () => {
    if (isSelectionMode) {
      onToggleSelect(file.id);
    } else {
      onPreview(file);
    }
  };
  const formatFileDate = (date: string) => {
      return format(date, "dd MMM. yyyy", { locale: ptBR });
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative flex flex-col items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl aspect-square shadow-sm cursor-pointer transition-all hover:scale-[1.02] border-2 group ${
        isSelected 
          ? 'border-yellow-500 ring-2 ring-yellow-500/20 bg-yellow-50/30 dark:bg-yellow-950/10' 
          : 'border-transparent hover:bg-gray-200 dark:hover:bg-zinc-700'
      }`}
    >
      {isSelectionMode && (
        <div className="absolute top-3 left-3 z-10" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(file.id)}
            className="w-5 h-5 accent-yellow-500 cursor-pointer rounded-md"
          />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center w-full">
        <div className={`relative w-24 h-24 ${iconBg} rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center transition-transform group-hover:scale-105`}>
          <IconComponent className={`size-8 lg:size-16 ${textColor} stroke-[1.5] mb-1`}/>
          <span className={`absolute bottom-2 text-white font-black text-[10px] tracking-wider px-1.5 py-0.5 rounded-md uppercase ${badgeColor}`}>
            .{fileExtension.toLowerCase()}
          </span>
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 text-center truncate w-full mt-2 px-1">
        {file.title}
      </p>
      <p className="text-xs text-gray-500">
        {formatFileDate(file.created_at)}
      </p>
    </div>
  );
};