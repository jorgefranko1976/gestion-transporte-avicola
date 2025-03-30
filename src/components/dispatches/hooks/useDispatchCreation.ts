
import { useState } from 'react';
import { CreateDispatchRequest } from '@/lib/types/dispatch-types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDispatchCreation = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createDispatch = async (dispatch: CreateDispatchRequest) => {
    setIsCreating(true);
    
    try {
      // Convertir los datos del formulario al formato esperado por la BD
      const dispatchData = {
        order_id: dispatch.orderId,
        loading_company: dispatch.loadingCompany,
        destination: dispatch.destination,
        zone: dispatch.zone || null,
        farm: dispatch.farm,
        farm_id: dispatch.farmId,
        packages: dispatch.packages,
        concentrate_amount: dispatch.concentrateAmount || null,
        eta: dispatch.eta ? dispatch.eta.toISOString() : null,
        status: 'pending'
      };
      
      // Insertar en Supabase
      const { data, error } = await supabase
        .from('dispatches')
        .insert(dispatchData)
        .select()
        .single();
      
      if (error) {
        console.error('Error al crear despacho:', error);
        toast.error(`Error al crear despacho: ${error.message}`);
        return null;
      }
      
      toast.success('Despacho creado exitosamente');
      return data;
      
    } catch (error) {
      console.error('Error en la creación del despacho:', error);
      toast.error('Error inesperado al crear el despacho');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    createDispatch
  };
};
