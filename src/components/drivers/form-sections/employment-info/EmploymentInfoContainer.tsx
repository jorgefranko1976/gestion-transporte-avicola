
import { UseFormReturn } from 'react-hook-form';
import { DriverFormValues } from '../../schemas/driverFormSchema';
import HireDateSection from './HireDateSection';
import LicenseExpirationSection from './LicenseExpirationSection';

interface EmploymentInfoContainerProps {
  form: UseFormReturn<DriverFormValues>;
}

const EmploymentInfoContainer = ({ form }: EmploymentInfoContainerProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-medium border-b pb-3">Información laboral</h3>
      <HireDateSection form={form} />
      <LicenseExpirationSection form={form} />
    </div>
  );
};

export default EmploymentInfoContainer;
