import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthenticationStrategy } from '../enums/authenticationStrategy.enum';

@Injectable()
export class AccessTokenGuard extends AuthGuard(AuthenticationStrategy.AccessToken) {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(executionContext: ExecutionContext) {
        const isPublic: boolean = this.reflector.getAllAndOverride("isPublic", [ executionContext.getHandler(), executionContext.getClass() ]);

        return isPublic ? true : super.canActivate(executionContext);
    }
}
