
import { X, FileSpreadsheet } from 'lucide-react';

interface FileInfoHeaderProps {
  selectedFile: File;
  onRemoveFile: () => void;
}

const FileInfoHeader = ({ selectedFile, onRemoveFile }: FileInfoHeaderProps) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-4">
      <FileSpreadsheet className="w-8 h-8 text-green-600" />
      <div className="flex-1 truncate">
        <p className="font-medium truncate">{selectedFile.name}</p>
        <p className="text-xs text-muted-foreground">
          {(selectedFile.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <button 
        onClick={onRemoveFile}
        className="text-gray-400 hover:text-gray-500"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FileInfoHeader;
