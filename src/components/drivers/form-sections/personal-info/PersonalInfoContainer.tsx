
import { UseFormReturn } from 'react-hook-form';
import { DriverFormValues } from '../../schemas/driverFormSchema';
import NameSection from './NameSection';
import IdentificationSection from './IdentificationSection';
import BirthDateSection from './BirthDateSection';
import ContactSection from './ContactSection';

interface PersonalInfoContainerProps {
  form: UseFormReturn<DriverFormValues>;
  calculateAge: (birthDate: Date | undefined) => string;
}

const PersonalInfoContainer = ({ form, calculateAge }: PersonalInfoContainerProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-medium border-b pb-3">Información personal</h3>
      
      <NameSection form={form} />
      <IdentificationSection form={form} />
      <BirthDateSection form={form} calculateAge={calculateAge} />
      <ContactSection form={form} />
    </div>
  );
};

export default PersonalInfoContainer;
