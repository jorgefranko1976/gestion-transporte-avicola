
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DriverPortal from "./pages/DriverPortal";
import CoordinatorPortal from "./pages/CoordinatorPortal";
import Vehicles from "./pages/Vehicles";
import Farms from "./pages/Farms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: JSX.Element, 
  allowedRole?: 'driver' | 'coordinator' 
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    // Could add a loading spinner here
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'driver' ? '/driver' : '/coordinator'} replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            
            <Route 
              path="/drivers" 
              element={
                <ProtectedRoute allowedRole="coordinator">
                  <CoordinatorPortal />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute allowedRole="coordinator">
                  <CoordinatorPortal />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/pesv" 
              element={
                <ProtectedRoute allowedRole="coordinator">
                  <CoordinatorPortal />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
