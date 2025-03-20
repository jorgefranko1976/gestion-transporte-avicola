
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, FileText, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Vehicle, VehicleType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

// Datos de ejemplo para vehículos
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC123",
    vehicleType: "camion",
    brand: "Ford",
    model: "2022",
    line: "Cargo",
    color: "Blanco",
    pbvRunt: "10000",
    emptyWeight: "5000",
    cargoLength: "8",
    power: "300",
    engineNumber: "MF12345",
    chassisNumber: "CF67890",
    documents: {
      soat: "/placeholder.svg",
      technicalInspection: "/placeholder.svg",
      rcPolicy: "/placeholder.svg",
      companyContract: "/placeholder.svg",
      propertyCard: "/placeholder.svg",
      photos: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    },
    ownerInfo: "Juan Pérez",
    active: true,
    createdAt: new Date("2023-05-15"),
  },
  {
    id: "2",
    plate: "XYZ789",
    vehicleType: "camioneta",
    brand: "Toyota",
    model: "2023",
    line: "Hilux",
    color: "Gris",
    pbvRunt: "3500",
    emptyWeight: "2000",
    cargoLength: "2",
    power: "150",
    engineNumber: "TH54321",
    chassisNumber: "TC98765",
    documents: {
      soat: "/placeholder.svg",
      technicalInspection: null,
      rcPolicy: "/placeholder.svg",
      companyContract: null,
      propertyCard: "/placeholder.svg",
      photos: ["/placeholder.svg"],
    },
    ownerInfo: "María González",
    active: true,
    createdAt: new Date("2023-08-22"),
  },
  {
    id: "3",
    plate: "DEF456",
    vehicleType: "dobletroque",
    brand: "Chevrolet",
    model: "2021",
    line: "NPR",
    color: "Azul",
    pbvRunt: "12000",
    emptyWeight: "7000",
    cargoLength: "5",
    power: "250",
    engineNumber: "CN78901",
    chassisNumber: "CE12345",
    documents: {
      soat: "/placeholder.svg",
      technicalInspection: "/placeholder.svg",
      rcPolicy: null,
      companyContract: "/placeholder.svg",
      propertyCard: "/placeholder.svg",
      photos: ["/placeholder.svg", "/placeholder.svg"],
    },
    ownerInfo: "Carlos Rodríguez",
    active: true,
    createdAt: new Date("2023-10-05"),
  },
  {
    id: "4",
    plate: "GHI789",
    vehicleType: "tracto camion",
    brand: "International",
    model: "2020",
    line: "9800",
    color: "Rojo",
    pbvRunt: "20000",
    emptyWeight: "9000",
    cargoLength: "12",
    power: "450",
    engineNumber: "IN45678",
    chassisNumber: "IC87654",
    documents: {
      soat: "/placeholder.svg",
      technicalInspection: "/placeholder.svg",
      rcPolicy: "/placeholder.svg",
      companyContract: "/placeholder.svg",
      propertyCard: "/placeholder.svg",
      photos: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    },
    ownerInfo: "Ana Martínez",
    active: false,
    createdAt: new Date("2023-02-18"),
  },
  {
    id: "5",
    plate: "JKL012",
    vehicleType: "camion liviano",
    brand: "Hino",
    model: "2022",
    line: "300",
    color: "Verde",
    pbvRunt: "7000",
    emptyWeight: "4000",
    cargoLength: "4",
    power: "180",
    engineNumber: "HN23456",
    chassisNumber: "HC65432",
    documents: {
      soat: null,
      technicalInspection: null,
      rcPolicy: "/placeholder.svg",
      companyContract: "/placeholder.svg",
      propertyCard: null,
      photos: [],
    },
    ownerInfo: "Pedro Sánchez",
    active: true,
    createdAt: new Date("2023-11-30"),
  },
];

const VehiclesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Función para traducir el tipo de vehículo
  const getVehicleTypeString = (type: VehicleType): string => {
    const types = {
      'camion': 'Camión',
      'camion liviano': 'Camión liviano',
      'dobletroque': 'Dobletroque',
      'camioneta': 'Camioneta',
      'tracto camion': 'Tracto camión'
    };
    return types[type] || type;
  };

  // Filtrar vehículos por término de búsqueda
  const filteredVehicles = mockVehicles.filter(vehicle => 
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getVehicleTypeString(vehicle.vehicleType).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (id: string) => {
    toast({
      title: "Ver detalles",
      description: `Viendo detalles del vehículo ${id}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Últimos vehículos agregados</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por placa, marca, modelo..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Nuevo Vehículo</span>
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Propietario</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.plate}</TableCell>
                <TableCell>{getVehicleTypeString(vehicle.vehicleType)}</TableCell>
                <TableCell>{vehicle.brand}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.ownerInfo}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    vehicle.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.active ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(vehicle.id)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Ver detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredVehicles.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No se encontraron vehículos con los criterios de búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VehiclesList;
