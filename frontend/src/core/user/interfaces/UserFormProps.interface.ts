import { UserFormData } from '../schemas/UserFormSchema.schema';

export interface UserFormProps {
    initialValues?: UserFormData;

    onCancel: () => void;
    onSubmit: () => void;
};