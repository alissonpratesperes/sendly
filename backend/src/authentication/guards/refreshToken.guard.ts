import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthenticationStrategy } from '../enums/authenticationStrategy.enum';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(AuthenticationStrategy.RefreshToken) {
    constructor() {
        super();
    }
}
