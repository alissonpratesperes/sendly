export function parseDateStringUtil(value: string): Date | null {
    const parts = value.split('/');

    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);

        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
            return date;
        };
    };

    return null;
};