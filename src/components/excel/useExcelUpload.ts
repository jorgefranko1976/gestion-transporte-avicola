
import { useState } from 'react';
import { ExcelPreviewData, ReproductoraDespatch, EngordeDespatch } from '@/lib/types';
import { sampleExcelDataType2 } from '@/data/mockData';
import { toast } from 'sonner';

export const useExcelUpload = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<ExcelPreviewData>({
    reproductora: [],
    engorde: [],
    totalRecords: 0
  });
  const [excelData, setExcelData] = useState<any[]>([]);
  const [lastUpdateDate, setLastUpdateDate] = useState('11/03/2025, 09:40 p. m.');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // In a real application, you would parse the Excel file here
      // For this example, we'll simulate it with data that matches the structure in the images
      
      // Sample data based on the first image (Reproductora sheet)
      const reproData: ReproductoraDespatch[] = [
        {
          ubicacion: 'GARAGOA',
          granja: 'BARSAL 1',
          lote: 'E30',
          planta: 'ALBATEQ-ALBATEQ',
          tipoAlimento: 'FASE 2 COBB',
          medicacion: 'FINBIOX-HEPATOSTAR-OVOCLEAN',
          dia: 'MARTES 25',
          cantidad: 275,
          ton: 11,
          orden: '224230',
          conductor: 'ANDRES SABOGAL',
          placa: 'WHK 426',
          cedula: '1,056,580,372',
          remisionPlanta: 'MIERCOLES 25',
          observaciones: '',
        },
        {
          ubicacion: 'GARAGOA',
          granja: 'SAN ESTEBAN 2',
          lote: 'E52',
          planta: 'ALBATEQ-ALBATEQ',
          tipoAlimento: 'LEVANTE',
          medicacion: 'SIN MEDICAR',
          dia: 'MIERCOLES 26',
          cantidad: 375,
          ton: 15,
          orden: '224231',
          conductor: 'FERNANDO VANEGAS',
          placa: 'SRD 194',
          cedula: '1048847155',
          remisionPlanta: 'MIERCOLES 25',
          observaciones: '',
        },
        {
          ubicacion: 'GUADUAS',
          granja: 'PORVENIR (UVE)',
          lote: 'E48',
          planta: 'ITALCOL-FUNZA',
          tipoAlimento: 'FASE 1 ROSS',
          medicacion: 'FINBIOX-HEPATOSTAR-OVOCLEAN',
          dia: 'MARTES 25',
          cantidad: 137,
          ton: 5.48,
          orden: '1114252',
          conductor: 'JAROL DURAN',
          placa: 'GIT 950',
          cedula: '1073511288',
          remisionPlanta: 'MIERCOLES 25',
          observaciones: '6:00 p. m.',
        },
      ];
      
      // Sample data based on the second image (Engorde sheet)
      const engordeData: EngordeDespatch[] = [
        {
          granja: 'NARANJAL (NARANJ)',
          dia: 'MARTES 25',
          planta: 'ALBATEQ-ALBATEQ',
          nomAlimento: 'ENGORDE CORRIENTE',
          cantidad: 200,
          toneladas: 8,
          confirmar: '',
          ubicacion: 'SAN FRANCISCO',
          tecnico: 'CARLOS CASTIBLANCO',
          orden: '224248',
          conductor: 'OSWALDO RODRIGUEZ',
          placa: 'WNX 547',
          cedula: '79137559',
          remision: 'MIERCOLES 26',
        },
        {
          granja: 'MIREYAS',
          dia: 'MARTES 25',
          planta: 'ALBATEQ-ALBATEQ',
          nomAlimento: 'ENGORDE CORRIENTE',
          cantidad: 125,
          toneladas: 5,
          confirmar: '',
          ubicacion: 'LA MESA',
          tecnico: 'CARLOS CENEN',
          orden: '224249',
          conductor: 'HUGO VEGA',
          placa: 'WPT 526',
          cedula: '80311610',
          remision: 'MIERCOLES 26',
        },
        {
          granja: 'VILLA LORENA',
          dia: 'MIERCOLES 26',
          planta: 'ALBATEQ-ALBATEQ',
          nomAlimento: 'ENGORDE PIGMENTADO',
          cantidad: 150,
          toneladas: 6,
          confirmar: '',
          ubicacion: 'FUSAGASUGA',
          tecnico: 'SONIA',
          orden: '224226',
          conductor: 'NELSON GARAVITO',
          placa: 'USB 969',
          cedula: '1003558901',
          remision: 'MIERCOLES 26',
        },
      ];
      
      setPreviewData({
        reproductora: reproData,
        engorde: engordeData,
        totalRecords: reproData.length + engordeData.length
      });
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadModal(false);
      setSelectedFile(null);
      
      // Store the data in the format expected by the application
      // Combine data from both sheets but maintain their distinct formats
      const combinedData = [
        ...previewData.reproductora.map(item => ({
          ...item,
          tipo: 'reproductora', // Add a type field to distinguish the data source
          fecha: item.dia,
          destino: item.planta,
          estado: 'pendiente'
        })),
        ...previewData.engorde.map(item => ({
          ...item, 
          tipo: 'engorde', // Add a type field to distinguish the data source
          fecha: item.dia,
          destino: item.planta,
          estado: 'pendiente'
        }))
      ];
      
      setExcelData(combinedData);
      setLastUpdateDate(new Date().toLocaleString());
      
      toast.success("Archivo subido con éxito", {
        description: `Se procesaron ${previewData.totalRecords} registros de despacho.`,
      });
      
      setPreviewData({
        reproductora: [],
        engorde: [],
        totalRecords: 0
      });
    }, 2000);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewData({
      reproductora: [],
      engorde: [],
      totalRecords: 0
    });
  };

  return {
    showUploadModal,
    setShowUploadModal,
    selectedFile,
    setSelectedFile,
    isUploading,
    previewData,
    excelData,
    lastUpdateDate,
    handleFileSelect,
    handleUpload,
    handleRemoveFile
  };
};
