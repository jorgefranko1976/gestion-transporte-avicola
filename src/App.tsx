
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DriverPortal from "./pages/DriverPortal";
import CoordinatorPortal from "./pages/CoordinatorPortal";
import Vehicles from "./pages/Vehicles";
import Farms from "./pages/Farms";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Drivers from "./pages/Drivers";
import PESV from "./pages/PESV";
import Reports from "./pages/Reports";
import { Loader2 } from "lucide-react";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: JSX.Element, 
  allowedRole?: 'driver' | 'coordinator' | 'admin' | 'owner'
}) => {
  const { user, isLoading } = useAuth();
  
  // Si está cargando, mostrar un spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }
  
  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    console.log("No hay usuario autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }
  
  // Si se requiere un rol específico y el usuario no lo tiene
  if (allowedRole && user.role !== allowedRole && allowedRole !== 'admin') {
    console.log(`Usuario no tiene rol requerido (${allowedRole}), tiene ${user.role}`);
    // Si es coordinador o admin, puede acceder a todas las rutas
    if (user.role === 'coordinator' || user.role === 'admin') {
      return children;
    }
    return <Navigate to={user.role === 'driver' ? '/driver' : 
                         user.role === 'owner' ? '/owner' : '/coordinator'} replace />;
  }
  
  // Si todo está bien, mostrar el contenido protegido
  return children;
};

// Componente de App con rutas protegidas
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route 
        path="/driver" 
        element={
          <ProtectedRoute allowedRole="driver">
            <DriverPortal />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/coordinator" 
        element={
          <ProtectedRoute allowedRole="coordinator">
            <CoordinatorPortal />
          </ProtectedRoute>
        } 
      />
      
      {/* Vehículos route */}
      <Route 
        path="/vehicles" 
        element={
          <ProtectedRoute allowedRole="coordinator">
            <Vehicles />
          </ProtectedRoute>
        } 
      />
      
      {/* Granjas route */}
      <Route 
        path="/farms" 
        element={
          <ProtectedRoute allowedRole="coordinator">
            <Farms />
          </ProtectedRoute>
        } 
      />
      
      {/* Settings route */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute allowedRole="coordinator">
            <Settings />
          </ProtectedRoute>
        } 
      />
      
      {/* Drivers route */}
      <Route 
        path="/drivers" 
        element={
          <ProtectedRoute allowedRole="coordinator">
            <Drivers />
          </ProtectedRoute>
        } 
      />
      
      {/* Reports route */}
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute allowedRole="coordinator">
            <Reports />
          </ProtectedRoute>
        } 
      />
      
      {/* PESV route */}
      <Route 
        path="/pesv" 
        element={
          <ProtectedRoute allowedRole="coordinator">
            <PESV />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all route - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Componente principal que configura los providers en el orden correcto
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
