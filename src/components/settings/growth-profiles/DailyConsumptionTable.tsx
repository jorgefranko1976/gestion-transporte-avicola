
import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { DailyConsumption } from "@/lib/types";

interface DailyConsumptionTableProps {
  items: DailyConsumption[];
  onChange: (items: DailyConsumption[]) => void;
}

const DailyConsumptionTable = ({ items, onChange }: DailyConsumptionTableProps) => {
  const [sortedItems, setSortedItems] = useState<DailyConsumption[]>(
    [...items].sort((a, b) => a.day - b.day)
  );

  const handleInputChange = (index: number, field: keyof DailyConsumption, value: string) => {
    const newItems = [...sortedItems];
    
    if (field === 'day') {
      // Aseguramos que el día sea un número entero positivo
      newItems[index][field] = Math.max(1, parseInt(value) || 1);
    } else {
      // Para campos numéricos con decimales
      newItems[index][field] = parseFloat(value) || 0;
    }
    
    // Ordenamos por día
    const sorted = newItems.sort((a, b) => a.day - b.day);
    setSortedItems(sorted);
    onChange(sorted);
  };

  const handleAddRow = () => {
    // Encontrar el último día y agregar uno nuevo con un día posterior
    const lastDay = sortedItems.length > 0 
      ? Math.max(...sortedItems.map(item => item.day))
      : 0;
    
    const newItem: DailyConsumption = {
      day: lastDay + 7,
      amountPerBird: 0,
      waterPerBird: 0,
      expectedWeight: 0,
    };
    
    const newItems = [...sortedItems, newItem].sort((a, b) => a.day - b.day);
    setSortedItems(newItems);
    onChange(newItems);
  };

  const handleRemoveRow = (index: number) => {
    if (sortedItems.length <= 1) {
      return; // Mantener al menos una fila
    }
    
    const newItems = sortedItems.filter((_, i) => i !== index);
    setSortedItems(newItems);
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Día</TableHead>
              <TableHead>Consumo (g/ave)</TableHead>
              <TableHead>Agua (ml/ave)</TableHead>
              <TableHead>Peso Esperado (g)</TableHead>
              <TableHead className="w-[80px]">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item, index) => (
              <TableRow key={`row-${index}`}>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={item.day}
                    onChange={(e) => handleInputChange(index, 'day', e.target.value)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={item.amountPerBird}
                    onChange={(e) => handleInputChange(index, 'amountPerBird', e.target.value)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={item.waterPerBird || 0}
                    onChange={(e) => handleInputChange(index, 'waterPerBird', e.target.value)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={item.expectedWeight || 0}
                    onChange={(e) => handleInputChange(index, 'expectedWeight', e.target.value)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRow(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={sortedItems.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddRow}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        <span>Agregar Día</span>
      </Button>
    </div>
  );
};

export default DailyConsumptionTable;
