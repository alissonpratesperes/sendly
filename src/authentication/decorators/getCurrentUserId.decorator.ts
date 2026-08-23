import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator((_data: undefined, executionContext: ExecutionContext): number => {
    const request = executionContext.switchToHttp().getRequest();

    return request.user.sub;
});
