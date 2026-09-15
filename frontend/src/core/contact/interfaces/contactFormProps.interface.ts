import { ContactFormData } from '../schemas/contactFormSchema.schema';

export interface ContactFormProps {
    initialValues?: ContactFormData;

    onCancel: () => void;
    onSubmit: () => void;
}
