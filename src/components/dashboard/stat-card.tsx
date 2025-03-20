
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isUp: boolean;
  };
  colorClass?: string;
  onClick?: () => void;
}

export const StatCard = ({
  icon,
  title,
  value,
  trend,
  colorClass = "bg-primary/10 text-primary",
  onClick,
}: StatCardProps) => (
  <Card 
    className={cn("transition-all duration-300 ease-apple hover:shadow-subtle", onClick ? "cursor-pointer hover:-translate-y-1" : "")} 
    onClick={onClick}
  >
    <CardHeader className="pb-2">
      <CardDescription>{title}</CardDescription>
    </CardHeader>
    <CardContent className="pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
            {icon}
          </div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend.isUp ? "text-green-500" : "text-red-500"
          )}>
            {trend.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
    </CardContent>
    <CardFooter className="pt-0 text-xs text-muted-foreground">
      Comparado con periodo anterior
    </CardFooter>
  </Card>
);

export default StatCard;
