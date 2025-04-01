
import { Badge } from "@/components/ui/badge";

interface DispatchSourceBadgeProps {
  source: string;
}

export const DispatchSourceBadge = ({ source }: DispatchSourceBadgeProps) => {
  return source === 'excel' 
    ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Excel</Badge>
    : <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sistema</Badge>;
};
