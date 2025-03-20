
import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, FileText, Trash2, Search } from "lucide-react";
import { Vehicle } from "@/lib/types";
import { Input } from "@/components/ui/input";
import VehicleDocumentSummary from "./VehicleDocumentSummary";

// Mock data for the vehicles list
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC123",
    vehicleType: "camion",
    brand: "Ford",
    model: "2020",
    line: "Cargo",
    color: "Blanco",
    pbvRunt: "10000",
    emptyWeight: "5000",
    cargoLength: "8",
    power: "300",
    engineNumber: "MF12345",
    chassisNumber: "CF67890",
    documents: {
      soat: "soat-abc123.pdf",
      soatExpiration: new Date(2023, 11, 31),
      technicalInspection: "tecnico-abc123.pdf",
      technicalInspectionExpiration: new Date(2023, 10, 15),
      rcPolicy: "rc-abc123.pdf",
      rcPolicyExpiration: new Date(2023, 9, 22),
      companyContract: "contrato-abc123.pdf",
      propertyCard: "tarjeta-abc123.pdf",
      photos: ["photo1.jpg", "photo2.jpg"]
    },
    owner: {
      firstName: "Juan",
      lastName: "Pérez",
      identificationType: "CC",
      identificationNumber: "1234567890",
      address: "Calle 123 #45-67",
      city: "Bogotá",
      phone: "3101234567",
      hasCredit: true,
      creditAmount: "50000000",
      creditTerm: "36",
      creditEndDate: new Date(2024, 5, 15),
      isPaid: false,
      documents: {
        identification: "cc-juan.pdf",
        rut: "rut-juan.pdf",
        bankCertification: null,
        dataProcessingConsent: "datos-juan.pdf",
        settlementCertificate: null,
        signedPromissoryNote: null,
        blankPromissoryInstructions: null
      }
    },
    active: true,
    createdAt: new Date(2022, 5, 10)
  },
  {
    id: "2",
    plate: "DEF456",
    vehicleType: "camioneta",
    brand: "Toyota",
    model: "2021",
    line: "Hilux",
    color: "Gris",
    pbvRunt: "5000",
    emptyWeight: "2500",
    cargoLength: "5",
    power: "200",
    engineNumber: "MT54321",
    chassisNumber: "CT98765",
    documents: {
      soat: "soat-def456.pdf",
      soatExpiration: new Date(2023, 8, 15),
      technicalInspection: "tecnico-def456.pdf",
      technicalInspectionExpiration: new Date(2023, 7, 20),
      rcPolicy: "rc-def456.pdf",
      rcPolicyExpiration: new Date(2023, 9, 10),
      companyContract: "contrato-def456.pdf",
      propertyCard: "tarjeta-def456.pdf",
      photos: ["photo3.jpg"]
    },
    owner: {
      firstName: "Maria",
      lastName: "González",
      identificationType: "CC",
      identificationNumber: "0987654321",
      address: "Av. Principal #12-34",
      city: "Medellín",
      phone: "3209876543",
      hasCredit: false,
      documents: {
        identification: "cc-maria.pdf",
        rut: "rut-maria.pdf",
        bankCertification: "banco-maria.pdf",
        dataProcessingConsent: "datos-maria.pdf",
        settlementCertificate: null,
        signedPromissoryNote: null,
        blankPromissoryInstructions: null
      }
    },
    active: true,
    createdAt: new Date(2022, 2, 5)
  },
  {
    id: "3",
    plate: "GHI789",
    vehicleType: "dobletroque",
    brand: "Chevrolet",
    model: "2019",
    line: "NPR",
    color: "Azul",
    pbvRunt: "15000",
    emptyWeight: "7000",
    cargoLength: "9",
    power: "350",
    engineNumber: "MG98765",
    chassisNumber: "CG12345",
    documents: {
      soat: "soat-ghi789.pdf",
      soatExpiration: new Date(2024, 1, 25),
      technicalInspection: "tecnico-ghi789.pdf",
      technicalInspectionExpiration: new Date(2024, 2, 10),
      rcPolicy: "rc-ghi789.pdf",
      rcPolicyExpiration: new Date(2024, 0, 5),
      companyContract: "contrato-ghi789.pdf",
      propertyCard: "tarjeta-ghi789.pdf",
      photos: ["photo4.jpg", "photo5.jpg", "photo6.jpg"]
    },
    owner: {
      firstName: "Carlos",
      lastName: "Rodríguez",
      identificationType: "NIT",
      identificationNumber: "9001234567",
      address: "Carrera 45 #67-89",
      city: "Cali",
      phone: "3157894561",
      hasCredit: true,
      creditAmount: "80000000",
      creditTerm: "48",
      creditEndDate: new Date(2025, 11, 31),
      isPaid: false,
      documents: {
        identification: "nit-carlos.pdf",
        rut: "rut-carlos.pdf",
        bankCertification: "banco-carlos.pdf",
        dataProcessingConsent: "datos-carlos.pdf",
        settlementCertificate: "pazysalvo-carlos.pdf",
        signedPromissoryNote: "pagare-carlos.pdf",
        blankPromissoryInstructions: "instrucciones-carlos.pdf"
      }
    },
    active: true,
    createdAt: new Date(2022, 0, 15)
  },
  {
    id: "4",
    plate: "JKL012",
    vehicleType: "camion liviano",
    brand: "Isuzu",
    model: "2022",
    line: "NQR",
    color: "Rojo",
    pbvRunt: "8000",
    emptyWeight: "4000",
    cargoLength: "7",
    power: "280",
    engineNumber: "MI45678",
    chassisNumber: "CI87654",
    documents: {
      soat: "soat-jkl012.pdf",
      soatExpiration: new Date(2023, 11, 5),
      technicalInspection: "tecnico-jkl012.pdf",
      technicalInspectionExpiration: new Date(2023, 10, 10),
      rcPolicy: "rc-jkl012.pdf",
      rcPolicyExpiration: new Date(2023, 9, 15),
      companyContract: null,
      propertyCard: "tarjeta-jkl012.pdf",
      photos: []
    },
    owner: {
      firstName: "Ana",
      lastName: "Martínez",
      identificationType: "CC",
      identificationNumber: "3216549870",
      address: "Calle 78 #90-12",
      city: "Barranquilla",
      phone: "3004567890",
      hasCredit: true,
      creditAmount: "40000000",
      creditTerm: "24",
      creditEndDate: new Date(2023, 5, 30),
      isPaid: true,
      documents: {
        identification: "cc-ana.pdf",
        rut: "rut-ana.pdf",
        bankCertification: "banco-ana.pdf",
        dataProcessingConsent: "datos-ana.pdf",
        settlementCertificate: null,
        signedPromissoryNote: "pagare-ana.pdf",
        blankPromissoryInstructions: "instrucciones-ana.pdf"
      }
    },
    active: false,
    createdAt: new Date(2022, 8, 20)
  },
  {
    id: "5",
    plate: "MNO345",
    vehicleType: "tracto camion",
    brand: "Kenworth",
    model: "2018",
    line: "T800",
    color: "Verde",
    pbvRunt: "20000",
    emptyWeight: "9000",
    cargoLength: "12",
    power: "450",
    engineNumber: "MK12345",
    chassisNumber: "CK67890",
    documents: {
      soat: "soat-mno345.pdf",
      soatExpiration: new Date(2023, 7, 20),
      technicalInspection: "tecnico-mno345.pdf",
      technicalInspectionExpiration: new Date(2023, 6, 15),
      rcPolicy: "rc-mno345.pdf",
      rcPolicyExpiration: new Date(2023, 8, 10),
      companyContract: "contrato-mno345.pdf",
      propertyCard: "tarjeta-mno345.pdf",
      photos: ["photo7.jpg"]
    },
    owner: {
      firstName: "Pedro",
      lastName: "López",
      identificationType: "CE",
      identificationNumber: "E123456",
      address: "Carrera 12 #34-56",
      city: "Bucaramanga",
      phone: "3183216540",
      hasCredit: false,
      documents: {
        identification: "ce-pedro.pdf",
        rut: "rut-pedro.pdf",
        bankCertification: null,
        dataProcessingConsent: "datos-pedro.pdf",
        settlementCertificate: null,
        signedPromissoryNote: null,
        blankPromissoryInstructions: null
      }
    },
    active: true,
    createdAt: new Date(2021, 11, 5)
  }
];

const VehiclesList = ({ onRegisterClick }: { onRegisterClick?: () => void }) => {
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);

  const handleViewDocuments = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDocumentsDialogOpen(true);
  };

  // Función para filtrar vehículos según la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVehicles(mockVehicles);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = mockVehicles.filter((vehicle) => 
        vehicle.plate.toLowerCase().includes(query) ||
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.owner.firstName.toLowerCase().includes(query) ||
        vehicle.owner.lastName.toLowerCase().includes(query) ||
        `${vehicle.owner.firstName.toLowerCase()} ${vehicle.owner.lastName.toLowerCase()}`.includes(query)
      );
      setFilteredVehicles(filtered);
    }
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Vehículos registrados</h3>
          <Button onClick={onRegisterClick}>Registrar Nuevo Vehículo</Button>
        </div>
      </div>

      {/* Campo de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Buscar por placa, marca, modelo o propietario..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Marca/Modelo</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Documentos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.plate}</TableCell>
                    <TableCell>
                      {(() => {
                        switch (vehicle.vehicleType) {
                          case "camion":
                            return "Camión";
                          case "camion liviano":
                            return "Camión liviano";
                          case "dobletroque":
                            return "Dobletroque";
                          case "camioneta":
                            return "Camioneta";
                          case "tracto camion":
                            return "Tracto camión";
                          default:
                            return vehicle.vehicleType;
                        }
                      })()}
                    </TableCell>
                    <TableCell>{`${vehicle.brand} / ${vehicle.model}`}</TableCell>
                    <TableCell>{`${vehicle.owner.firstName} ${vehicle.owner.lastName}`}</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.active ? "default" : "destructive"}>
                        {vehicle.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleViewDocuments(vehicle)}
                      >
                        <FileText className="h-4 w-4" />
                        <span>Ver</span>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No se encontraron vehículos que coincidan con la búsqueda
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedVehicle && (
        <VehicleDocumentSummary
          vehicle={selectedVehicle}
          open={documentsDialogOpen}
          onOpenChange={setDocumentsDialogOpen}
        />
      )}
    </div>
  );
};

export default VehiclesList;
