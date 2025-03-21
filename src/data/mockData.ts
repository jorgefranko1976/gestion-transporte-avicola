// Mock data for vehicles
export const recentVehicles = [
  { id: '1', plate: 'WHK 426', type: 'camion', brand: 'Chevrolet', model: '2020', status: 'activo' },
  { id: '2', plate: 'SRD 194', type: 'dobletroque', brand: 'Ford', model: '2019', status: 'activo' },
  { id: '3', plate: 'WPK 570', type: 'camioneta', brand: 'Toyota', model: '2021', status: 'mantenimiento' },
  { id: '4', plate: 'XXB 191', type: 'camion liviano', brand: 'Mitsubishi', model: '2018', status: 'activo' },
  { id: '5', plate: 'XXR 556', type: 'tracto camion', brand: 'Kenworth', model: '2017', status: 'activo' },
];

// Mock data for drivers
export const recentDrivers = [
  { id: '1', name: 'ANDRES SABOGAL', identification: 'CC 80311610', plate: 'WHK 426', phone: '300-123-4567', status: 'en ruta' },
  { id: '2', name: 'FERNANDO VANEGAS', identification: 'CC 1003558901', plate: 'SRD 194', phone: '315-765-4321', status: 'en ruta' },
  { id: '3', name: 'MARTIN CHAVEZ', identification: 'CC 19.223.941', plate: 'WPK 570', phone: '310-987-6543', status: 'disponible' },
  { id: '4', name: 'HENRY ESGUERRA', identification: 'CC 74335546', plate: 'XXB 191', phone: '301-234-5678', status: 'en ruta' },
];

// Mock data for dispatch stats
export const dispatchStats = {
  pending: 12,
  inProgress: 8,
  completed: 24,
  delayed: 2,
  cancelled: 1,
  total: 47,
};

// Mock data for Excel data
export const sampleExcelDataType2 = [
  {
    id: '1',
    ubicacion: 'GARAGOA',
    granja: 'BARSAL 1',
    lote: '630',
    planta: 'ALBATEQ-ALBATEQ',
    alimento: 'FASE 2 COBB',
    medicacion: 'FINBIOX-HEPATOSTAR-OVOCLEAN',
    dia: 'MARTES 25',
    cantidad: '275',
    ton: '11',
    orden: '224230',
    conductor: 'ANDRES SABOGAL',
    placa: 'WHK 426',
    tipo: 'reproductora',
    estado: 'en ruta',
    horaEstimada: '14:30',
    horaDespacho: '09:15'
  },
  {
    id: '2',
    ubicacion: 'GARAGOA',
    granja: 'SAN ESTEBAN 2',
    lote: '652',
    planta: 'ALBATEQ-ALBATEQ',
    alimento: 'LEVANTE',
    medicacion: 'SIN MEDICAR',
    dia: 'MIERCOLES 26',
    cantidad: '375',
    ton: '15',
    orden: '224231',
    conductor: 'FERNANDO VANEGAS',
    placa: 'SRD 194',
    tipo: 'reproductora',
    estado: 'pendiente',
    horaEstimada: '16:45',
    horaDespacho: '10:30'
  },
  {
    id: '3',
    ubicacion: 'GARAGOA',
    granja: 'SAN MIGUEL',
    lote: '617',
    planta: 'ALBATEQ-ALBATEQ',
    alimento: 'FASE 3 ROSS',
    medicacion: 'FINBIOX-HEPATOSTAR-OVOCLEAN',
    dia: 'MIERCOLES 26',
    cantidad: '350',
    ton: '14',
    orden: '224234',
    conductor: 'MARTIN CHAVEZ',
    placa: 'WPK 570',
    tipo: 'engorde',
    estado: 'completado',
    horaEstimada: '12:30',
    horaDespacho: '08:15'
  },
  {
    id: '4',
    ubicacion: 'GARAGOA',
    granja: 'ZONA CENTRAL BAJA',
    lote: '618',
    planta: 'ITALCOL-FUNZA',
    alimento: 'FASE 2 COBB',
    medicacion: 'PX CYROMICINA-FINBIOX-HEPATOSTAR-OVOCLEAN',
    dia: 'MIERCOLES 26',
    cantidad: '350',
    ton: '14',
    orden: '1114222',
    conductor: 'HENRY ESGUERRA',
    placa: 'XXB191',
    tipo: 'engorde',
    estado: 'demorado',
    horaEstimada: '11:15',
    horaDespacho: '07:30'
  },
  {
    id: '5',
    ubicacion: 'GARAGOA',
    granja: 'ZONA CENTRAL BAJA',
    lote: '618',
    planta: 'ITALCOL-FUNZA',
    alimento: 'MACHOS COBB',
    medicacion: 'SIN MEDICAR',
    dia: 'MIERCOLES 26',
    cantidad: '25',
    ton: '1',
    orden: '1114222',
    conductor: 'HENRY ESGUERRA',
    placa: 'XXB191',
    tipo: 'engorde',
    estado: 'completado',
    horaEstimada: '09:45',
    horaDespacho: '06:30'
  },
  {
    id: '6',
    ubicacion: 'TUNJA',
    granja: 'LAS BRISAS',
    lote: '712',
    planta: 'ALBATEQ-ALBATEQ',
    alimento: 'FASE 1 ROSS',
    medicacion: 'SIN MEDICAR',
    dia: 'JUEVES 27',
    cantidad: '320',
    ton: '13',
    orden: '224250',
    conductor: 'ANDRES SABOGAL',
    placa: 'WHK 426',
    tipo: 'reproductora',
    estado: 'pendiente',
    horaEstimada: '15:00',
    horaDespacho: '10:15'
  },
  {
    id: '7',
    ubicacion: 'TUNJA',
    granja: 'VIENTO LIBRE',
    lote: '680',
    planta: 'ITALCOL-FUNZA',
    alimento: 'FASE 2 ROSS',
    medicacion: 'FINBIOX-HEPATOSTAR',
    dia: 'JUEVES 27',
    cantidad: '290',
    ton: '12',
    orden: '1114240',
    conductor: 'FERNANDO VANEGAS',
    placa: 'SRD 194',
    tipo: 'engorde',
    estado: 'pendiente',
    horaEstimada: '16:30',
    horaDespacho: '11:00'
  },
];

// Mock data for charts
export const dispatchesByStatus = [
  { name: 'Pendientes', value: 12, color: '#64748b' },
  { name: 'En Ruta', value: 8, color: '#3b82f6' },
  { name: 'Completados', value: 24, color: '#22c55e' },
  { name: 'Demorados', value: 2, color: '#f59e0b' },
  { name: 'Cancelados', value: 1, color: '#ef4444' },
];

export const documentsToExpire = [
  { id: 1, type: 'SOAT', vehicle: 'WPK 570', expireDate: '18/04/2025', daysRemaining: 15 },
  { id: 2, type: 'Tecnicomecánica', vehicle: 'XXB 191', expireDate: '24/04/2025', daysRemaining: 21 },
  { id: 3, type: 'Licencia', driver: 'FERNANDO VANEGAS', expireDate: '30/04/2025', daysRemaining: 27 },
  { id: 4, type: 'Seguro Contractual', vehicle: 'SRD 194', expireDate: '05/05/2025', daysRemaining: 32 },
];

export const chartConfig = {
  pendientes: { label: "Pendientes", color: "#64748b" },
  enRuta: { label: "En Ruta", color: "#3b82f6" },
  completados: { label: "Completados", color: "#22c55e" },
  demorados: { label: "Demorados", color: "#f59e0b" },
  cancelados: { label: "Cancelados", color: "#ef4444" },
};

import { VehicleOwner } from "@/lib/types";

// Datos de ejemplo para propietarios
export const mockOwners: VehicleOwner[] = [
  {
    id: "owner-1",
    firstName: "Juan",
    lastName: "Pérez",
    identificationType: "CC",
    identificationNumber: "1020304050",
    address: "Calle 123 #45-67",
    city: "Bogotá",
    phone: "3001234567",
    hasCredit: false,
    documents: {
      identification: null,
      rut: null,
      bankCertification: null,
      dataProcessingConsent: null,
      settlementCertificate: null,
      signedPromissoryNote: null,
      blankPromissoryInstructions: null,
    }
  },
  {
    id: "owner-2",
    firstName: "María",
    lastName: "Rodríguez",
    identificationType: "CC",
    identificationNumber: "5060708090",
    address: "Avenida 456 #78-90",
    city: "Medellín",
    phone: "3109876543",
    hasCredit: true,
    creditAmount: "50000000",
    creditTerm: "36",
    creditEndDate: new Date("2025-12-31"),
    isPaid: false,
    documents: {
      identification: null,
      rut: null,
      bankCertification: null,
      dataProcessingConsent: null,
      settlementCertificate: null,
      signedPromissoryNote: null,
      blankPromissoryInstructions: null,
    }
  },
  {
    id: "owner-3",
    firstName: "Carlos",
    lastName: "González",
    identificationType: "NIT",
    identificationNumber: "900123456-7",
    address: "Carrera 789 #12-34",
    city: "Cali",
    phone: "3201234567",
    hasCredit: false,
    documents: {
      identification: null,
      rut: null,
      bankCertification: null,
      dataProcessingConsent: null,
      settlementCertificate: null,
      signedPromissoryNote: null,
      blankPromissoryInstructions: null,
    }
  }
];
