
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Dispatch {
  id: string;
  orderId: string;
  date: Date;
  origin: string;
  destination: string;
  vehiclePlate: string | null;
  driverName: string | null;
}

export const exportDispatchesToCSV = (dispatches: Dispatch[]) => {
  if (dispatches.length === 0) {
    return false;
  }
  
  // Create CSV content
  const headers = [
    "Orden", 
    "Fecha", 
    "Origen", 
    "Destino", 
    "Placa", 
    "Conductor"
  ].join(",");
  
  const csvRows = dispatches.map(d => [
    d.orderId,
    format(d.date, "dd/MM/yyyy HH:mm", { locale: es }),
    d.origin,
    d.destination,
    d.vehiclePlate || "No asignado",
    d.driverName || "No asignado"
  ].join(","));
  
  const csvContent = [headers, ...csvRows].join("\n");
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `despachos_${format(new Date(), "dd-MM-yyyy")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};
