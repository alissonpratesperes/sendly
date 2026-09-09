import { RegionalFormData } from '../schemas/RegionalFormSchema.schema';

export interface RegionalFormProps {
    initialValues?: RegionalFormData;

    onCancel: () => void;
    onSubmit: () => void;
};