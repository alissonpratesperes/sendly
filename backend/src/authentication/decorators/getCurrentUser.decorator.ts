import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { CurrentUser } from '../interfaces/currentUser.interface';

export const GetCurrentUser = createParamDecorator((data: (keyof CurrentUser)[] | undefined, executionContext: ExecutionContext) => {
    const request = executionContext.switchToHttp().getRequest<{ user: CurrentUser }>();

    return data ? Object.fromEntries(data.map((key) => [key, request.user[key]])) : request.user;
});
