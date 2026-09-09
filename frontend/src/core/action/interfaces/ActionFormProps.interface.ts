import { ActionFormData } from '../schemas/ActionFormSchema.schema';

export interface ActionFormProps {
    initialValues?: ActionFormData;

    onCancel: () => void;
    onSubmit: () => void;
};