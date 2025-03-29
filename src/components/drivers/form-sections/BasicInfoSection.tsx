
import { UseFormReturn } from 'react-hook-form';
import { DriverFormValues } from '../schemas/driverFormSchema';
import PersonalInfoContainer from './personal-info/PersonalInfoContainer';
import EmploymentInfoContainer from './employment-info/EmploymentInfoContainer';

interface BasicInfoSectionProps {
  form: UseFormReturn<DriverFormValues>;
  calculateAge: (birthDate: Date | undefined) => string;
}

const BasicInfoSection = ({ form, calculateAge }: BasicInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PersonalInfoContainer form={form} calculateAge={calculateAge} />
      <EmploymentInfoContainer form={form} />
    </div>
  );
};

export default BasicInfoSection;
