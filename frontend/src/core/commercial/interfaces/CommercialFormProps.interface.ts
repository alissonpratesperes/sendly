import { CommercialFormData } from "../schemas/CommercialFormSchema.schema";

export interface CommercialFormProps {
    initialValues?: CommercialFormData;

    onCancel: () => void;
    onSubmit: () => void;
};