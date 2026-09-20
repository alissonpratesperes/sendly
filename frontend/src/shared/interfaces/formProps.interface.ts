export interface FormProps<T> {
    initialValues?: T;

    onCancel: () => void;
    onSubmit: () => void;
    onLoadingChange: (isSubmitting: boolean) => void;
}
