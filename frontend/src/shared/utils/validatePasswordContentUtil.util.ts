export function validatePasswordContentUtil(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)/;

    return regex.test(password);
};