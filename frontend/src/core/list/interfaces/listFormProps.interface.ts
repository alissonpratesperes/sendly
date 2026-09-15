import { ListFormData } from '../schemas/listFormSchema.schema';

export interface ListFormProps {
    initialValues?: ListFormData;

    onCancel: () => void;
    onSubmit: () => void;
}
