import { ChainFormData } from '../schemas/ChainFormSchema.schema';

export interface ChainFormProps {
    initialValues?: ChainFormData;

    onCancel: () => void;
    onSubmit: () => void;
};