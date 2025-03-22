
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Inspection } from '../types/inspection-types';

interface InspectionsTableProps {
  inspections: Inspection[];
  onViewDetails: (inspection: Inspection) => void;
}

const InspectionsTable = ({ inspections, onViewDetails }: InspectionsTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Fecha</th>
              <th className="px-4 py-3 text-left font-medium">Vehículo</th>
              <th className="px-4 py-3 text-left font-medium">Conductor</th>
              <th className="px-4 py-3 text-left font-medium">Estado General</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {inspections.map((inspection) => {
              // Calcular estado general
              const checks = [
                inspection.tiresOk,
                inspection.lightsOk,
                inspection.brakesOk,
                inspection.mirrorsOk,
                inspection.oilOk,
                inspection.waterOk,
                inspection.kitOk
              ];
              const totalChecks = checks.length;
              const passedChecks = checks.filter(Boolean).length;
              const isPassing = passedChecks === totalChecks;
              
              return (
                <tr key={inspection.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{format(inspection.date, "dd MMM yyyy, HH:mm", { locale: es })}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{inspection.vehiclePlate}</td>
                  <td className="px-4 py-3">{inspection.driverName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isPassing ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-medium">Aprobado</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 font-medium">
                            {passedChecks}/{totalChecks} puntos
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(inspection)}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InspectionsTable;
