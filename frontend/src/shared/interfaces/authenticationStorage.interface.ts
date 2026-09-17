import { AuthenticatedUser } from "../../core/authentication/interfaces/authenticatedUser.interface";

export interface AuthenticationStorage {
    accessToken: string | null;
    refreshToken: string | null;
    userInformation: AuthenticatedUser | null;
}
