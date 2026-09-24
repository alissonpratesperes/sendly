export type ParsedContact = {
    name: string;
    phone: string | null;
    normalizedPhone: string | null;
    country: string | null;
    error: string | null;
}
