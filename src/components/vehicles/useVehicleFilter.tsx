
import { useState, useEffect } from "react";
import { Vehicle } from "@/lib/types";

const useVehicleFilter = (vehicles: Vehicle[]) => {
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVehicles(vehicles);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = vehicles.filter((vehicle) => 
        vehicle.plate.toLowerCase().includes(query) ||
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.owner.firstName.toLowerCase().includes(query) ||
        vehicle.owner.lastName.toLowerCase().includes(query) ||
        `${vehicle.owner.firstName.toLowerCase()} ${vehicle.owner.lastName.toLowerCase()}`.includes(query)
      );
      setFilteredVehicles(filtered);
    }
  }, [searchQuery, vehicles]);

  return {
    filteredVehicles,
    searchQuery,
    setSearchQuery
  };
};

export default useVehicleFilter;
