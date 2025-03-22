
import React from 'react';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ExpirationDatePickerProps {
  expirationDate: Date | null;
  onExpirationChange: (date: Date | null) => void;
  className?: string;
}

export const ExpirationDatePicker = ({
  expirationDate,
  onExpirationChange,
  className
}: ExpirationDatePickerProps) => {
  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground mb-1">
        Fecha de vencimiento:
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full flex items-center justify-center gap-2",
              !expirationDate && "text-muted-foreground"
            )}
          >
            {expirationDate ? (
              format(expirationDate, "dd/MM/yyyy")
            ) : (
              <span>Seleccionar fecha de Vencimiento</span>
            )}
            <Calendar className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <CalendarComponent
            mode="single"
            selected={expirationDate || undefined}
            onSelect={onExpirationChange}
            disabled={(date) => date < new Date()}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
