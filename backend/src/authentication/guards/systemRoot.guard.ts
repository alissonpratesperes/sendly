import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { IS_SYSTEM_ROOT_KEY } from '../decorators/isSystemRoot.decorator';

@Injectable()
export class SystemRootGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(executionContext: ExecutionContext): boolean {
        const requiresSystemRootUserAccess = this.reflector.getAllAndOverride<boolean>(IS_SYSTEM_ROOT_KEY, [
            executionContext.getHandler(),
            executionContext.getClass()
        ]);

        if (!requiresSystemRootUserAccess) {
            return true;
        }

        const request = executionContext.switchToHttp().getRequest();

        if (!request.user?.isSystemRoot) {
            throw new ForbiddenException("System root required");
        }

        return true;
    }
}
