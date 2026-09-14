export function decodeJwt(token: string): Record<string, unknown> | null {
    try {
        const [, payload] = token.split(".");

        if (!payload) {
            return null;
        }

        const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = atob(normalizedPayload);

        return JSON.parse(decodedPayload);
    } catch {
        return null;
    }
}
