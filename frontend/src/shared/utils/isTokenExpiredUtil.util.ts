export function isTokenExpiredUtil(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;

        if (exp) {
            const currentTime = Math.floor(Date.now() / 1000);

            return currentTime >= exp;
        };

        return true;
    } catch (error) {
        return true;
    };
};