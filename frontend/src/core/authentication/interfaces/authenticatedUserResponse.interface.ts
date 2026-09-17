import { AuthenticatedUser } from './authenticatedUser.interface';
import { AuthenticationTokenPair } from '../types/authenticationTokenPair.type';

export interface AuthenticatedUserResponse extends AuthenticationTokenPair {
    user: AuthenticatedUser;
}
