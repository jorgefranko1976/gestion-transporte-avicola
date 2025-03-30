
import React from 'react';
import { useDispatchForm } from './hooks/useDispatchForm';
import { Form } from '@/components/ui/form';
import { OrderSection } from './form-sections/OrderSection';
import { DestinationSection } from './form-sections/DestinationSection';
import { FarmSection } from './form-sections/FarmSection';
import { DetailSection } from './form-sections/DetailSection';
import { FormActions } from './form-sections/FormActions';

const DispatchForm = () => {
  const { form, isCreating, openCalendar, setOpenCalendar, handleSubmit } = useDispatchForm();

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-6">Crear Nuevo Despacho</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <OrderSection form={form} />
          <DestinationSection form={form} />
          <FarmSection form={form} />
          <DetailSection 
            form={form} 
            openCalendar={openCalendar} 
            setOpenCalendar={setOpenCalendar} 
          />
          <FormActions form={form} isCreating={isCreating} />
        </form>
      </Form>
    </div>
  );
};

export default DispatchForm;
