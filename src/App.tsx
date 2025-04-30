
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DriverPortal from "./pages/DriverPortal";
import CoordinatorPortal from "./pages/CoordinatorPortal";
import Vehicles from "./pages/Vehicles";
import Farms from "./pages/Farms";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Drivers from "./pages/Drivers";
import PESV from "./pages/PESV";
import Reports from "./pages/Reports";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

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

// Componente principal que configura los providers en el orden correcto
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/driver" element={<DriverPortal />} />
            <Route path="/coordinator" element={<CoordinatorPortal />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/farms" element={<Farms />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/pesv" element={<PESV />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
