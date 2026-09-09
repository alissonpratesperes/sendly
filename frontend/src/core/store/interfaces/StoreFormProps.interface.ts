import { StoreFormData } from '../schemas/StoreFormSchema.schema';

export interface StoreFormProps {
    initialValues?: StoreFormData;

    onCancel: () => void;
    onSubmit: () => void;
};