import { decodeJwt } from './decodeJwt.util';

export function verifyExpiredToken(token: string): boolean {
    const payload = decodeJwt(token);

    if (!payload || typeof payload.exp !== "number") {
        return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime >= payload.exp;
}
