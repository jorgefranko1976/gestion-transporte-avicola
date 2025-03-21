import { sampleExcelDataType2 } from "@/data/mockData";
import { StatusBadge } from "@/components/ui/status-badge";
import { Filter, Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ExcelContentProps {
  excelData: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeDataType: 'reproductora' | 'engorde';
  setActiveDataType: (type: 'reproductora' | 'engorde') => void;
  activeDispatchStatus: 'todos' | 'pendiente' | 'en ruta' | 'completado' | 'demorado';
  setActiveDispatchStatus: (status: 'todos' | 'pendiente' | 'en ruta' | 'completado' | 'demorado') => void;
  lastUpdateDate: string;
  onUploadClick: () => void;
}

export const ExcelContent = ({
  excelData,
  searchTerm,
  setSearchTerm,
  activeDataType,
  setActiveDataType,
  activeDispatchStatus,
  setActiveDispatchStatus,
  lastUpdateDate,
  onUploadClick
}: ExcelContentProps) => {
  
  const filteredData = excelData.filter(item => {
    const matchesSearchTerm =
      item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.granja.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orden.includes(searchTerm);

    const matchesType = activeDataType === item.tipo;
    const matchesStatus = activeDispatchStatus === 'todos' || item.estado === activeDispatchStatus;

    return matchesSearchTerm && matchesType && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold">Datos Excel</h2>
          <p className="text-sm text-muted-foreground">
            Última actualización: {lastUpdateDate}
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[240px]"
            />
          </div>
          <Button 
            onClick={onUploadClick}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Cargar Excel</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div>
          <p className="text-sm font-medium mb-2">Tipo de Alimento</p>
          <ToggleGroup type="single" value={activeDataType} onValueChange={(value) => value && setActiveDataType(value as 'reproductora' | 'engorde')}>
            <ToggleGroupItem value="reproductora">Reproductora</ToggleGroupItem>
            <ToggleGroupItem value="engorde">Engorde</ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Estado de Despacho</p>
          <ToggleGroup type="single" value={activeDispatchStatus} onValueChange={(value) => value && setActiveDispatchStatus(value as 'todos' | 'pendiente' | 'en ruta' | 'completado' | 'demorado')}>
            <ToggleGroupItem value="todos">Todos</ToggleGroupItem>
            <ToggleGroupItem value="pendiente">Pendiente</ToggleGroupItem>
            <ToggleGroupItem value="en ruta">En Ruta</ToggleGroupItem>
            <ToggleGroupItem value="completado">Completado</ToggleGroupItem>
            <ToggleGroupItem value="demorado">Demorado</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Granja</TableHead>
              <TableHead>Alimento</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Hora Estimada</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.orden}</TableCell>
                  <TableCell>{item.ubicacion}</TableCell>
                  <TableCell>{item.granja}</TableCell>
                  <TableCell>{item.alimento}</TableCell>
                  <TableCell>{item.cantidad}</TableCell>
                  <TableCell>{item.conductor}</TableCell>
                  <TableCell>{item.placa}</TableCell>
                  <TableCell>{item.horaEstimada}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.estado} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                  No hay datos que coincidan con los filtros seleccionados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationPrevious href="#" />
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationNext href="#" />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ExcelContent;
