import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

import { IS_PUBLIC_KEY } from '../decorators/isPublic.decorator';
import { AuthenticationStrategy } from '../enums/authenticationStrategy.enum';

@Injectable()
export class AccessTokenGuard extends AuthGuard(AuthenticationStrategy.AccessToken) {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(executionContext: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            executionContext.getHandler(),
            executionContext.getClass()
        ]);

        return isPublic ? true : super.canActivate(executionContext);
    }
}
