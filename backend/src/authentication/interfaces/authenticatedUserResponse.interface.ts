import { AuthenticatedUser } from './authenticatedUser.interface';
import { AuthenticationTokenPair } from '../types/AuthenticationTokenPair.type';

export interface AuthenticatedUserResponse extends AuthenticationTokenPair {
    user: AuthenticatedUser;
}
