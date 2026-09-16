import { CountryCode } from 'libphonenumber-js';

export interface CreateContactCommandDto {
    companyId: number;
    listId: number;
    name: string;
    phone: string;
    country: CountryCode | "";
}
