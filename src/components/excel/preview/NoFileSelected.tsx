
import { FileText } from 'lucide-react';

const NoFileSelected = () => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex-1 flex flex-col items-center justify-center">
      <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600 mb-4">
        No hay ningún archivo Excel seleccionado
      </p>
    </div>
  );
};

export default NoFileSelected;
