import { UserFormData } from '../schemas/userFormSchema.schema';

export interface UserFormProps {
    initialValues?: UserFormData;

    onCancel: () => void;
    onSubmit: () => void;
}
