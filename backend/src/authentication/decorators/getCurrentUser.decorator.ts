import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator((data: string | undefined, executionContext: ExecutionContext) => {
    const request = executionContext.switchToHttp().getRequest();

    return data ? request.user[data] : request.user;
});
