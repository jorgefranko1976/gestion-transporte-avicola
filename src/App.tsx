
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import { Suspense, lazy } from "react";
import { UserRole } from "@/types/auth";

// Crear cliente de query
const queryClient = new QueryClient();

// Componente de carga
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
      <p className="mt-4 text-lg">Cargando...</p>
    </div>
  </div>
);

// Protected route component (solo se usa después de que AuthProvider esté disponible)
const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: JSX.Element, 
  allowedRole?: UserRole
}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Si está cargando, mostrar un spinner
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    console.log("No hay usuario autenticado, redirigiendo a /login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Si se requiere un rol específico y el usuario no lo tiene
  if (allowedRole && user.role !== allowedRole && user.role !== 'admin' && user.role !== 'coordinator') {
    console.log(`Usuario no tiene rol requerido (${allowedRole}), tiene ${user.role}`);
    
    // Redirigir al portal correspondiente según el rol del usuario
    let redirectPath = '/';
    if (user.role === 'driver') {
      redirectPath = '/driver';
    } else if (user.role === 'owner') {
      redirectPath = '/owner';
    } else if (user.role === 'coordinator') {
      redirectPath = '/coordinator';
    } else if (user.role === 'admin') {
      redirectPath = '/coordinator'; // Los administradores van al portal de coordinador por defecto
    }
    
    return <Navigate to={redirectPath} replace />;
  }
  
  // Si todo está bien, mostrar el contenido protegido
  return children;
};

// Separamos las rutas en un componente individual que se renderiza DENTRO del AuthProvider
const AppRoutes = () => (
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

// Componente principal que configura los providers en el orden correcto
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </AuthProvider>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
