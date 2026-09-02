import { BadRequestException } from '@nestjs/common';
import type { CountryCode } from 'libphonenumber-js';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function formatContactPhoneNumber(phone: string, country: CountryCode): string {
    const phoneNumber = parsePhoneNumberFromString(phone, {
        defaultCountry: country,
        extract: false,
    });

    if (!phoneNumber || !phoneNumber.isValid()) {
        throw new BadRequestException("Invalid phone number");
    }

    return phoneNumber.number;
}
