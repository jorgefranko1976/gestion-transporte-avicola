
import { ReproductoraDespatch } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatColumnName, formatCellValue } from './formatHelpers';

interface ReproductoraSheetPreviewProps {
  data: ReproductoraDespatch[];
}

const ReproductoraSheetPreview = ({ data }: ReproductoraSheetPreviewProps) => {
  if (!data.length) return null;
  
  // Define key columns for readability - not showing all columns to save space
  const keyColumns = [
    'ubicacion', 'granja', 'lote', 'planta', 'tipoAlimento', 
    'dia', 'cantidad', 'ton', 'orden', 'conductor', 'placa'
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
                  {formatCellValue(row[column as keyof ReproductoraDespatch])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReproductoraSheetPreview;
