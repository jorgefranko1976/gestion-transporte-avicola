
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  id: number;
  type: string;
  vehicle?: string;
  driver?: string;
  expireDate: string;
  daysRemaining: number;
}

export const DocumentCard = ({
  id,
  type,
  vehicle,
  driver,
  expireDate,
  daysRemaining,
}: DocumentCardProps) => (
  <div className="border border-border rounded-lg p-4 bg-card">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium">{type}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {vehicle && `Vehículo: ${vehicle}`}
          {driver && `Conductor: ${driver}`}
        </p>
      </div>
      <div
        className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          daysRemaining <= 15 ? "bg-red-100 text-red-700" :
          daysRemaining <= 30 ? "bg-amber-100 text-amber-700" :
          "bg-green-100 text-green-700"
        )}
      >
        {daysRemaining} días
      </div>
    </div>
    <div className="flex justify-between items-center mt-4">
      <span className="text-sm text-muted-foreground">Vence: {expireDate}</span>
      <Button variant="outline" size="sm" className="h-8">
        Ver documento
      </Button>
    </div>
  </div>
);

export default DocumentCard;
