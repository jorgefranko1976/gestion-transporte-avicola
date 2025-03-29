
import { Form } from '@/components/ui/form';
import { UserProfile } from '@/lib/types';
import { useUserForm } from './hooks/useUserForm';
import PersonalInfoSection from './form-sections/PersonalInfoSection';
import IdentificationSection from './form-sections/IdentificationSection';
import RoleAndPhoneSection from './form-sections/RoleAndPhoneSection';
import StatusSection from './form-sections/StatusSection';
import FormActions from './form-sections/FormActions';

interface UserFormProps {
  initialData?: UserProfile;
  onSave: (data: UserProfile) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSave, onCancel }) => {
  const { form, handleSubmit } = useUserForm({ initialData, onSave, onCancel });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoSection form={form} />
        <IdentificationSection form={form} />
        <RoleAndPhoneSection form={form} />
        <StatusSection form={form} />
        <FormActions isEditing={!!initialData} onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default UserForm;
