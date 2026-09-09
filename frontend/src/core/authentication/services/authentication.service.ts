import { LoginCommandDto } from '../dtos/loginCommand.dto';
import axiosInstance from '../interceptors/authorization.interceptor';
import { AuthenticationTokenPair } from '../interfaces/authenticationTokenPair.interface';

const endpoint = "authentication/login";

export const authenticate = async (command: LoginCommandDto) => {
    const response = await axiosInstance.post<AuthenticationTokenPair>(endpoint, command);

    return response;
}
