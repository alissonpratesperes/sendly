export interface FormProps<T> {
    initialValues?: T;
    disabled?: boolean;

    onCancel: () => void;
    onSubmit: () => void;
    onLoadingChange: (isSubmitting: boolean) => void;
    onPairingSuccess?: (pairingCode: string) => void;
}
