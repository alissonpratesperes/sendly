export class ImportContactErrorDto {
    constructor(
        public name: string,
        public phone: string | null,
        public normalizedPhone: string | null,
        public country: string | null,
        public error: string,
    ) {}
}
