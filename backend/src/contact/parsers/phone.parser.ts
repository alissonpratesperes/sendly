import parsePhoneNumberFromString from 'libphonenumber-js';

export const parseContactPhone = (phone: string) => {
    const trimmedPhone = phone.trim();
    const parsedPhone = trimmedPhone.startsWith("+")
        ? parsePhoneNumberFromString(trimmedPhone)
        : parsePhoneNumberFromString(trimmedPhone, "BR");

    if (!parsedPhone || !parsedPhone.isValid()) {
        return null;
    }

    return {
        phone: parsedPhone.number,
        country: parsedPhone.country,
    };
}
