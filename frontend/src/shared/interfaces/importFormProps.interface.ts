export interface ImportFormProps {
    onCancel: () => void;
    onSubmit: () => void;
    onLoadingChange: (isSubmitting: boolean) => void;
}
