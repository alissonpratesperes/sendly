import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

function calculateCnpjDigit(base: string): number {
    let sum = 0;
    let weight = base.length - 7;

    for (const digit of base) {
        sum += Number(digit) * weight;
        weight--;

        if (weight === 1) {
            weight = 9;
        }
    }

    const remainder = sum % 11;

    return remainder < 2 ? 0 : 11 - remainder;
}

@ValidatorConstraint({ name: 'isValidCnpj', async: false })
export class IsValidCnpjConstraint implements ValidatorConstraintInterface {
    validate(value: unknown): boolean {
        if (typeof value !== "string") {
            return false;
        }
        if (!/^\d{14}$/.test(value)) {
            return false;
        }
        if (/^(\d)\1{13}$/.test(value)) {
            return false;
        }

        const firstBase = value.substring(0, 12);
        const firstDigit = calculateCnpjDigit(firstBase);

        if (firstDigit !== Number(value[12])) {
            return false;
        }

        const secondBase = value.substring(0, 13);
        const secondDigit = calculateCnpjDigit(secondBase);

        return secondDigit === Number(value[13]);
    }

    defaultMessage(): string {
        return "Company document must be a valid CNPJ";
    }
}

export function IsValidCnpj(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsValidCnpjConstraint,
        });
    };
}
