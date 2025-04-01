
import { useDispatchData } from "./hooks/useDispatchData";
import { DispatchesTable } from "./components/DispatchesTable";
import { DispatchesLoading } from "./components/DispatchesLoading";
import { DispatchesEmpty } from "./components/DispatchesEmpty";
import { DispatchesError } from "./components/DispatchesError";
import { toast } from "sonner";
import { useEffect } from "react";

interface DispatchesListProps {
  searchTerm: string;
  excelData: any[];
}

const DispatchesList = ({ searchTerm, excelData }: DispatchesListProps) => {
  const { dispatches, isLoading, error, isEmpty } = useDispatchData({ 
    searchTerm, 
    excelData 
  });
  
  useEffect(() => {
    if (excelData.length > 0) {
      toast.info(`Se encontraron ${excelData.length} registros desde Excel`, {
        description: "Los despachos de Excel y del sistema se muestran juntos en la tabla."
      });
      console.log("Excel data being used:", excelData);
    }
  }, [excelData]);
  
  if (isLoading && excelData.length === 0) {
    return <DispatchesLoading />;
  }
  
  if (error && excelData.length === 0) {
    return <DispatchesError error={error} />;
  }
  
  if (isEmpty) {
    return <DispatchesEmpty />;
  }
  
  return <DispatchesTable dispatches={dispatches} searchTerm={searchTerm} />;
};

export default DispatchesList;
