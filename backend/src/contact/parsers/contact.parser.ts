import { parseContactPhone } from './phone.parser';
import { ParsedContact } from '../types/parsedContact.type';
import { CsvContactAfter } from '../interfaces/csvContactAfter.interface';

export const parseContacts = (contacts: CsvContactAfter[]): ParsedContact[] => {
    return contacts.flatMap<ParsedContact>((contact: CsvContactAfter) => {
        if (!contact.phone) {
            return [{
                name: contact.name,
                phone: null,
                normalizedPhone: null,
                country: null,
                error: "Phone was not informed correctly",
            }];
        }

        const phones = contact.phone.split(";").map((phone) => phone.trim()).filter(Boolean);

        return phones.map((phone) => {
            const parsedPhone = parseContactPhone(phone);

            if (!parsedPhone) {
                return {
                    name: contact.name,
                    phone,
                    normalizedPhone: null,
                    country: null,
                    error: "Invalid phone number",
                };
            }

            return {
                name: contact.name,
                phone,
                normalizedPhone: parsedPhone.phone,
                country: parsedPhone.country ?? null,
                error: null,
            };
        });
    });
}
