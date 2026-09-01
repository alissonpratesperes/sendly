import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator((_data: undefined, executionContext: ExecutionContext): number => {
    const request = executionContext.switchToHttp().getRequest<{ user: { id: number } }>();

    return request.user.id;
});
