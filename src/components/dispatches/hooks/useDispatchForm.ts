
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useDispatchCreation } from './useDispatchCreation';
import { dispatchFormSchema, DispatchFormValues } from '../schemas/dispatchFormSchema';

export const useDispatchForm = () => {
  const { isCreating, createDispatch } = useDispatchCreation();
  const [openCalendar, setOpenCalendar] = useState(false);

  // Inicializar el formulario
  const form = useForm<DispatchFormValues>({
    resolver: zodResolver(dispatchFormSchema),
    defaultValues: {
      orderId: '',
      loadingCompany: '',
      destination: '',
      zone: '',
      farm: '',
      farmId: '',
      packages: 1,
      concentrateAmount: undefined,
      eta: null
    }
  });

  const handleSubmit = async (values: DispatchFormValues) => {
    // Asegurarse de que los campos requeridos no son undefined
    const dispatchData = {
      orderId: values.orderId,
      loadingCompany: values.loadingCompany,
      destination: values.destination,
      zone: values.zone || '',
      farm: values.farm,
      farmId: values.farmId,
      packages: values.packages,
      concentrateAmount: values.concentrateAmount,
      eta: values.eta
    };
    
    const result = await createDispatch(dispatchData);
    if (result) {
      form.reset();
      toast.success('Despacho creado correctamente');
    }
  };

  return {
    form,
    isCreating,
    openCalendar,
    setOpenCalendar,
    handleSubmit
  };
};
