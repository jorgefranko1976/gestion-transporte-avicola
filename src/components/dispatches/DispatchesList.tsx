
import { useDispatchData } from "./hooks/useDispatchData";
import { DispatchesTable } from "./components/DispatchesTable";
import { DispatchesLoading } from "./components/DispatchesLoading";
import { DispatchesEmpty } from "./components/DispatchesEmpty";
import { DispatchesError } from "./components/DispatchesError";

interface DispatchesListProps {
  searchTerm: string;
  excelData: any[];
}

const DispatchesList = ({ searchTerm, excelData }: DispatchesListProps) => {
  const { dispatches, isLoading, error, isEmpty } = useDispatchData({ 
    searchTerm, 
    excelData 
  });
  
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
