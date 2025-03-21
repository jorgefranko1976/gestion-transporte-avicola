
import { UseFormReturn } from 'react-hook-form';
import { DriverFormValues } from '../driver-form-schema';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { WorkInfoSection } from './components/WorkInfoSection';
import { calculateAge } from './components/utils';

interface BasicInformationTabProps {
  form: UseFormReturn<DriverFormValues>;
}

export const BasicInformationTab = ({ form }: BasicInformationTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PersonalInfoSection form={form} calculateAge={calculateAge} />
      <WorkInfoSection form={form} />
    </div>
  );
};

export default BasicInformationTab;
