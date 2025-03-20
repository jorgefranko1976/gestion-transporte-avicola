
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import PageTransition from '@/components/transitions/PageTransition';
import { useState } from 'react';
import { Check, Clock, Package, CalendarDays, MapPin, AlertCircle, Truck } from 'lucide-react';
import { Dispatch } from '@/lib/types';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockDispatches: Dispatch[] = [
  {
    id: '1',
    orderId: 'ORD-2023-0542',
    driverId: '1',
    vehiclePlate: 'ABC123',
    loadingCompany: 'Distribuidora Avícola S.A.',
    destination: 'Medellín, Antioquia',
    zone: 'Zona Norte',
    farm: 'Granja El Amanecer',
    packages: 250,
    status: 'pending',
    acceptedAt: null,
    completedAt: null,
    eta: new Date(Date.now() + 24 * 60 * 60 * 1000),
    receiptImageUrl: null,
    createdAt: new Date(),
  },
  {
    id: '2',
    orderId: 'ORD-2023-0543',
    driverId: '1',
    vehiclePlate: 'ABC123',
    loadingCompany: 'Pollos del Valle S.A.S.',
    destination: 'Cali, Valle del Cauca',
    zone: 'Zona Occidental',
    farm: 'Granja San Pedro',
    packages: 180,
    status: 'accepted',
    acceptedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: null,
    eta: new Date(Date.now() + 20 * 60 * 60 * 1000),
    receiptImageUrl: null,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
];

const DriverPortal = () => {
  const { user } = useAuth();
  const [dispatches, setDispatches] = useState<Dispatch[]>(mockDispatches);
  const [selectedDispatch, setSelectedDispatch] = useState<Dispatch | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleAcceptDispatch = (dispatch: Dispatch) => {
    setDispatches(prevDispatches => 
      prevDispatches.map(d => 
        d.id === dispatch.id 
          ? { ...d, status: 'accepted', acceptedAt: new Date() } 
          : d
      )
    );
  };

  const handleUploadReceipt = (dispatch: Dispatch, file: File) => {
    setUploadedFile(file);
    // In a real app, you would upload the file to a server
    console.log('Uploaded receipt for dispatch:', dispatch.id, file);
  };

  const handleCompleteDispatch = (dispatch: Dispatch) => {
    setDispatches(prevDispatches => 
      prevDispatches.map(d => 
        d.id === dispatch.id 
          ? { ...d, status: 'completed', completedAt: new Date() } 
          : d
      )
    );
    setSelectedDispatch(null);
  };

  const StatusBadge = ({ status }: { status: Dispatch['status'] }) => {
    const statusConfig = {
      pending: { 
        text: 'Pendiente', 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
      },
      accepted: { 
        text: 'En Progreso', 
        className: 'bg-blue-100 text-blue-800 border-blue-200' 
      },
      in_progress: { 
        text: 'En Ruta', 
        className: 'bg-blue-100 text-blue-800 border-blue-200' 
      },
      delayed: { 
        text: 'Retrasado', 
        className: 'bg-orange-100 text-orange-800 border-orange-200' 
      },
      completed: { 
        text: 'Completado', 
        className: 'bg-green-100 text-green-800 border-green-200' 
      },
      cancelled: { 
        text: 'Cancelado', 
        className: 'bg-red-100 text-red-800 border-red-200' 
      },
    };

    const config = statusConfig[status];

    return (
      <span className={cn(
        "chip inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className
      )}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <PageTransition>
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-full md:w-3/4 space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl font-bold">Despachos Asignados</h1>
                  
                  <div className="bg-transport-50 text-transport-800 px-3 py-1.5 rounded-lg border border-transport-200 flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4" />
                    <span>Placa: <strong>{user?.name ? 'ABC123' : 'No asignado'}</strong></span>
                  </div>
                </div>
                
                <div className="glass-morphism rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Orden</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Destino</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Empresa</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Bultos</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Estado</th>
                          <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {dispatches.map((dispatch) => (
                          <tr 
                            key={dispatch.id} 
                            className="hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedDispatch(dispatch)}
                          >
                            <td className="px-6 py-4 text-sm">{dispatch.orderId}</td>
                            <td className="px-6 py-4 text-sm">{dispatch.destination}</td>
                            <td className="px-6 py-4 text-sm">{dispatch.loadingCompany}</td>
                            <td className="px-6 py-4 text-sm">{dispatch.packages}</td>
                            <td className="px-6 py-4 text-sm">
                              <StatusBadge status={dispatch.status} />
                            </td>
                            <td className="px-6 py-4 text-sm text-right">
                              {dispatch.status === 'pending' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAcceptDispatch(dispatch);
                                  }}
                                  className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 transition-colors btn-hover focus-ring"
                                >
                                  Aceptar
                                </button>
                              )}
                              
                              {dispatch.status === 'accepted' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDispatch(dispatch);
                                  }}
                                  className="px-3 py-1.5 bg-transport-600 text-white text-xs rounded-lg hover:bg-transport-700 transition-colors btn-hover focus-ring"
                                >
                                  Detalles
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        
                        {dispatches.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                              No hay despachos asignados actualmente
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/4 space-y-6">
                <div className="glass-morphism rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Panel de Conductor</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{user?.name || 'Usuario'}</p>
                        <p className="text-xs text-muted-foreground">Conductor</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Despachos Pendientes</span>
                        <span className="font-medium">{dispatches.filter(d => d.status === 'pending').length}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">En Progreso</span>
                        <span className="font-medium">{dispatches.filter(d => d.status === 'accepted' || d.status === 'in_progress').length}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Completados (Hoy)</span>
                        <span className="font-medium">{dispatches.filter(d => d.status === 'completed').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-transport-50 text-transport-800 rounded-xl p-6 border border-transport-200">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="font-medium">Recordatorio</h3>
                  </div>
                  <p className="text-sm">
                    Recuerda subir la remisión de cada despacho completado para mantener actualizado el sistema.
                  </p>
                </div>
              </div>
            </div>
          </PageTransition>
          
          {/* Dispatch Detail Modal */}
          {selectedDispatch && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div 
                className="glass-morphism rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-lg animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Detalles del Despacho</h2>
                    <button 
                      onClick={() => setSelectedDispatch(null)}
                      className="p-1 rounded-full hover:bg-muted transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Número de Orden</p>
                        <p className="font-medium">{selectedDispatch.orderId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Estado</p>
                        <StatusBadge status={selectedDispatch.status} />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Empresa de Cargue</p>
                          <p className="font-medium">{selectedDispatch.loadingCompany}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Destino / Granja</p>
                          <p className="font-medium">{selectedDispatch.destination}</p>
                          <p className="text-sm">{selectedDispatch.farm} - {selectedDispatch.zone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cantidad de Bultos</p>
                          <p className="font-medium">{selectedDispatch.packages} bultos</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tiempo de Entrega</p>
                          <p className="font-medium">
                            {selectedDispatch.acceptedAt 
                              ? `24 horas desde ${selectedDispatch.acceptedAt.toLocaleString()}` 
                              : 'No iniciado'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {selectedDispatch.status === 'accepted' && (
                      <div className="border-t border-border pt-6">
                        <h3 className="font-medium mb-3">Subir Remisión</h3>
                        <div className="space-y-4">
                          <label className="block">
                            <span className="text-sm text-muted-foreground">
                              Seleccione una foto de la remisión firmada
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleUploadReceipt(selectedDispatch, e.target.files[0]);
                                }
                              }}
                              className="mt-1 block w-full text-sm text-muted-foreground
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-medium
                                file:bg-primary file:text-white
                                hover:file:bg-primary/90
                                transition-colors"
                            />
                          </label>
                          
                          {uploadedFile && (
                            <div className="text-sm text-muted-foreground">
                              Archivo seleccionado: {uploadedFile.name}
                            </div>
                          )}
                          
                          <button
                            onClick={() => handleCompleteDispatch(selectedDispatch)}
                            disabled={!uploadedFile}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
                          >
                            <Check className="w-4 h-4" />
                            <span>Completar Despacho</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DriverPortal;
