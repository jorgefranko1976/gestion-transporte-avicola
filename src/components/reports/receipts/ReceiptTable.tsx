
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { FileCheck } from 'lucide-react';
import { ReceiptReport } from './types';

interface ReceiptTableProps {
  receipts: ReceiptReport[];
  onViewReceipt: (imageUrl: string | null) => void;
}

export const ReceiptTable = ({ receipts, onViewReceipt }: ReceiptTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Orden</th>
              <th className="px-4 py-3 text-left font-medium">Fecha</th>
              <th className="px-4 py-3 text-left font-medium">Vehículo</th>
              <th className="px-4 py-3 text-left font-medium">Conductor</th>
              <th className="px-4 py-3 text-left font-medium">Destino</th>
              <th className="px-4 py-3 text-left font-medium">Remisión</th>
              <th className="px-4 py-3 text-right font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {receipts.map((receipt) => (
              <tr key={receipt.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{receipt.orderId}</td>
                <td className="px-4 py-3">
                  {format(receipt.completedAt, "dd MMM yyyy, HH:mm", { locale: es })}
                </td>
                <td className="px-4 py-3">{receipt.vehiclePlate}</td>
                <td className="px-4 py-3">{receipt.driverName || 'No asignado'}</td>
                <td className="px-4 py-3">{receipt.destination}</td>
                <td className="px-4 py-3">
                  {receipt.receiptImageUrl ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <FileCheck className="w-4 h-4" />
                      <span>Disponible</span>
                    </span>
                  ) : (
                    <span className="text-red-600">No disponible</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewReceipt(receipt.receiptImageUrl)}
                    disabled={!receipt.receiptImageUrl}
                  >
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
