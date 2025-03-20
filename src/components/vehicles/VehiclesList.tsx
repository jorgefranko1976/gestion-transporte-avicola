
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, FileText, FileClock, Search, Car } from "lucide-react";
import { Vehicle } from "@/lib/types";

// Datos de ejemplo - En una aplicación real, esto vendría de una API
const sampleVehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC123",
    vehicleType: "camion",
    brand: "Kenworth",
    model: "2020",
    line: "T800",
    color: "Rojo",
    pbvRunt: "35000",
    emptyWeight: "15000",
    cargoLength: "8",
    power: "450",
    engineNumber: "KW78954",
    chassisNumber: "CH45678",
    documents: {
      soat: "url-soat-1.pdf",
      soatExpiration: new Date(2024, 9, 15),
      technicalInspection: "url-tecnica-1.pdf",
      technicalInspectionExpiration: new Date(2024, 8, 20),
      rcPolicy: "url-rc-1.pdf",
      rcPolicyExpiration: new Date(2024, 11, 5),
      companyContract: "url-contrato-1.pdf",
      propertyCard: "url-tarjeta-1.pdf",
      photos: ["url-foto-1.jpg", "url-foto-2.jpg"],
    },
    owner: {
      firstName: "Juan",
      lastName: "Pérez",
      identificationType: "CC",
      identificationNumber: "1234567890",
      address: "Calle 123 #45-67",
      city: "Bogotá",
      phone: "3101234567",
      hasCredit: false,
      documents: {
        identification: "url-cedula-1.pdf",
        rut: "url-rut-1.pdf",
        bankCertification: null,
        dataProcessingConsent: "url-datos-1.pdf",
        settlementCertificate: null,
      }
    },
    active: true,
    createdAt: new Date(2023, 5, 10),
  },
  {
    id: "2",
    plate: "DEF456",
    vehicleType: "camioneta",
    brand: "Toyota",
    model: "2022",
    line: "Hilux",
    color: "Blanco",
    pbvRunt: "3500",
    emptyWeight: "2200",
    cargoLength: "2.5",
    power: "175",
    engineNumber: "TY45678",
    chassisNumber: "CH98765",
    documents: {
      soat: "url-soat-2.pdf",
      soatExpiration: new Date(2024, 5, 20),
      technicalInspection: "url-tecnica-2.pdf",
      technicalInspectionExpiration: new Date(2024, 4, 15),
      rcPolicy: "url-rc-2.pdf",
      rcPolicyExpiration: new Date(2024, 6, 10),
      companyContract: "url-contrato-2.pdf",
      propertyCard: "url-tarjeta-2.pdf",
      photos: ["url-foto-3.jpg"],
    },
    owner: {
      firstName: "María",
      lastName: "Gómez",
      identificationType: "NIT",
      identificationNumber: "9876543210",
      address: "Carrera 45 #12-34",
      city: "Medellín",
      phone: "3209876543",
      hasCredit: true,
      creditAmount: "50000000",
      creditTerm: "36",
      creditEndDate: new Date(2025, 3, 15),
      isPaid: false,
      documents: {
        identification: "url-nit-2.pdf",
        rut: "url-rut-2.pdf",
        bankCertification: "url-banco-2.pdf",
        dataProcessingConsent: "url-datos-2.pdf",
        settlementCertificate: null,
      }
    },
    active: true,
    createdAt: new Date(2023, 8, 5),
  },
  {
    id: "3",
    plate: "GHI789",
    vehicleType: "dobletroque",
    brand: "International",
    model: "2021",
    line: "4700",
    color: "Azul",
    pbvRunt: "25000",
    emptyWeight: "12000",
    cargoLength: "6.5",
    power: "350",
    engineNumber: "INT12345",
    chassisNumber: "CH12345",
    documents: {
      soat: "url-soat-3.pdf",
      soatExpiration: new Date(2024, 3, 5),
      technicalInspection: "url-tecnica-3.pdf",
      technicalInspectionExpiration: new Date(2024, 2, 20),
      rcPolicy: "url-rc-3.pdf",
      rcPolicyExpiration: new Date(2024, 4, 10),
      companyContract: "url-contrato-3.pdf",
      propertyCard: "url-tarjeta-3.pdf",
      photos: ["url-foto-4.jpg", "url-foto-5.jpg", "url-foto-6.jpg"],
    },
    owner: {
      firstName: "Carlos",
      lastName: "Ramírez",
      identificationType: "CC",
      identificationNumber: "5678901234",
      address: "Avenida 67 #89-12",
      city: "Cali",
      phone: "3156789012",
      hasCredit: true,
      creditAmount: "40000000",
      creditTerm: "24",
      creditEndDate: new Date(2023, 11, 20),
      isPaid: true,
      documents: {
        identification: "url-cedula-3.pdf",
        rut: "url-rut-3.pdf",
        bankCertification: "url-banco-3.pdf",
        dataProcessingConsent: "url-datos-3.pdf",
        settlementCertificate: "url-paz-3.pdf",
      }
    },
    active: false,
    createdAt: new Date(2023, 2, 15),
  },
  {
    id: "4",
    plate: "JKL012",
    vehicleType: "tracto camion",
    brand: "Freightliner",
    model: "2019",
    line: "Cascadia",
    color: "Negro",
    pbvRunt: "40000",
    emptyWeight: "18000",
    cargoLength: "N/A",
    power: "500",
    engineNumber: "FL98765",
    chassisNumber: "CH56789",
    documents: {
      soat: "url-soat-4.pdf",
      soatExpiration: new Date(2024, 8, 15),
      technicalInspection: "url-tecnica-4.pdf",
      technicalInspectionExpiration: new Date(2024, 7, 10),
      rcPolicy: "url-rc-4.pdf",
      rcPolicyExpiration: new Date(2024, 9, 25),
      companyContract: "url-contrato-4.pdf",
      propertyCard: "url-tarjeta-4.pdf",
      photos: ["url-foto-7.jpg", "url-foto-8.jpg"],
    },
    owner: {
      firstName: "Ana",
      lastName: "Martínez",
      identificationType: "CE",
      identificationNumber: "E123456",
      address: "Calle 78 #90-123",
      city: "Barranquilla",
      phone: "3187654321",
      hasCredit: false,
      documents: {
        identification: "url-ce-4.pdf",
        rut: "url-rut-4.pdf",
        bankCertification: "url-banco-4.pdf",
        dataProcessingConsent: "url-datos-4.pdf",
        settlementCertificate: null,
      }
    },
    active: true,
    createdAt: new Date(2022, 11, 1),
  },
  {
    id: "5",
    plate: "MNO345",
    vehicleType: "camion liviano",
    brand: "Hino",
    model: "2021",
    line: "Serie 300",
    color: "Blanco",
    pbvRunt: "12000",
    emptyWeight: "7000",
    cargoLength: "5",
    power: "240",
    engineNumber: "HI54321",
    chassisNumber: "CH87654",
    documents: {
      soat: "url-soat-5.pdf",
      soatExpiration: new Date(2024, 7, 5),
      technicalInspection: "url-tecnica-5.pdf",
      technicalInspectionExpiration: new Date(2024, 6, 20),
      rcPolicy: "url-rc-5.pdf",
      rcPolicyExpiration: new Date(2024, 8, 15),
      companyContract: "url-contrato-5.pdf",
      propertyCard: "url-tarjeta-5.pdf",
      photos: ["url-foto-9.jpg"],
    },
    owner: {
      firstName: "Luis",
      lastName: "García",
      identificationType: "CC",
      identificationNumber: "9012345678",
      address: "Carrera 12 #34-56",
      city: "Bucaramanga",
      phone: "3001234567",
      hasCredit: true,
      creditAmount: "25000000",
      creditTerm: "18",
      creditEndDate: new Date(2024, 5, 10),
      isPaid: false,
      documents: {
        identification: "url-cedula-5.pdf",
        rut: "url-rut-5.pdf",
        bankCertification: null,
        dataProcessingConsent: "url-datos-5.pdf",
        settlementCertificate: null,
      }
    },
    active: true,
    createdAt: new Date(2023, 3, 20),
  }
];

const VehiclesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>(sampleVehicles);
  
  // Filtrar vehículos según término de búsqueda
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.owner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.owner.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Función para manejar la eliminación de un vehículo
  const handleDelete = (id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Input
            placeholder="Buscar vehículo por placa, marca o propietario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
          <Button variant="outline" size="sm" className="h-9 px-3">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-9">
            <FileText className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/6">Placa</TableHead>
              <TableHead className="w-1/6">Tipo</TableHead>
              <TableHead className="w-1/6">Marca/Modelo</TableHead>
              <TableHead className="w-1/4">Propietario</TableHead>
              <TableHead className="w-1/6">Estado</TableHead>
              <TableHead className="text-right w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.plate}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="capitalize">{vehicle.vehicleType}</span>
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.brand} {vehicle.model}</TableCell>
                  <TableCell>
                    {vehicle.owner.firstName} {vehicle.owner.lastName}
                    <div className="text-xs text-muted-foreground">{vehicle.owner.identificationType}: {vehicle.owner.identificationNumber}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vehicle.active ? "success" : "destructive"} className="capitalize">
                      {vehicle.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleDelete(vehicle.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm 
                    ? "No se encontraron vehículos que coincidan con la búsqueda." 
                    : "No hay vehículos registrados aún."}
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
