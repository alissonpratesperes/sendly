import { CompanyFormData } from '../schemas/companyFormSchema.schema';

export interface CompanyFormProps {
    initialValues?: CompanyFormData;

    onCancel: () => void;
    onSubmit: () => void;
}
