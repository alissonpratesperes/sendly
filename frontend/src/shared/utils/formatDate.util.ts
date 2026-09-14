export const formatDate = (date: string, multiline: boolean = false) => {
    const parsedDate = new Date(date);
    const datePart = parsedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    const timePart = parsedDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return multiline ? `${datePart}\n${timePart}` : `${datePart}, ${timePart}`;
}
