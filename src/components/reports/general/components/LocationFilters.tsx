
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationFiltersProps {
  origin: string;
  setOrigin: (origin: string) => void;
  destination: string;
  setDestination: (destination: string) => void;
  origins: string[];
  destinations: string[];
}

export const LocationFilters = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  origins,
  destinations
}: LocationFiltersProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Origen</label>
        <Select value={origin} onValueChange={setOrigin}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los orígenes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los orígenes</SelectItem>
            {origins.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Destino</label>
        <Select value={destination} onValueChange={setDestination}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los destinos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los destinos</SelectItem>
            {destinations.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
