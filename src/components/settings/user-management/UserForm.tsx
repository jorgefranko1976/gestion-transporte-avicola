
import React from 'react';
import { useForm } from 'react-hook-form';
import { UserProfile } from '@/lib/types';
import { Form } from '@/components/ui/form';
import PersonalInfoFields from './form-components/PersonalInfoFields';
import IdentificationFields from './form-components/IdentificationFields';
import RoleAndStatusFields from './form-components/RoleAndStatusFields';
import FormActions from './form-components/FormActions';

interface UserFormProps {
  initialData?: UserProfile;
  onSave: (data: UserProfile) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSave, onCancel }) => {
  const form = useForm<UserProfile>({
    defaultValues: initialData || {
      email: '',
      firstName: '',
      lastName: '',
      role: 'driver',
      identificationType: 'CC',
      identificationNumber: '',
      phone: '',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '',
    },
  });

  const handleSubmit = (data: UserProfile) => {
    onSave({
      ...data,
      id: initialData?.id || '',
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <IdentificationFields form={form} />
        <RoleAndStatusFields form={form} />
        <FormActions isEditing={!!initialData} onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default UserForm;
