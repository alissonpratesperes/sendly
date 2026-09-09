import { CategoryFormData } from '../schemas/CategoryFormSchema.schema';

export interface CategoryFormProps {
    initialValues?: CategoryFormData;

    onCancel: () => void;
    onSubmit: () => void;
};