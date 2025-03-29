
import { useForm } from 'react-hook-form';
import { UserProfile } from '@/lib/types';

interface UseUserFormProps {
  initialData?: UserProfile;
  onSave: (data: UserProfile) => void;
  onCancel: () => void;
}

export const useUserForm = ({ initialData, onSave, onCancel }: UseUserFormProps) => {
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

  return {
    form,
    handleSubmit,
    onCancel
  };
};
