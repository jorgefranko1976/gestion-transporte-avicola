
import { EngordeDespatch } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatColumnName, formatCellValue } from './formatHelpers';

interface EngordeSheetPreviewProps {
  data: EngordeDespatch[];
}

const EngordeSheetPreview = ({ data }: EngordeSheetPreviewProps) => {
  if (!data.length) return null;
  
  // Define key columns for readability - not showing all columns to save space
  const keyColumns = [
    'granja', 'dia', 'planta', 'nomAlimento', 'cantidad', 
    'toneladas', 'ubicacion', 'tecnico', 'orden', 'conductor', 'placa'
  ];
  
  return (
    <div className="h-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {keyColumns.map((column) => (
              <TableHead key={column} className="text-xs whitespace-nowrap">
                {formatColumnName(column)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {keyColumns.map((column) => (
                <TableCell key={`${idx}-${column}`} className="text-xs">
                  {formatCellValue(row[column as keyof EngordeDespatch])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EngordeSheetPreview;
