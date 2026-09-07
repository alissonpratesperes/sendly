import { Observable } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

@Injectable()
export class CompanyContextInterceptor implements NestInterceptor {
    constructor(
        private readonly cls: ClsService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user?.companyId) {
            this.cls.set("companyId", user.companyId);
        }

        return next.handle();
    }
}
