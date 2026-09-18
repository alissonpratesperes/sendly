import { ClsService } from 'nestjs-cls';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '../../user/user.service';
import { AuthenticationStrategy } from '../enums/authenticationStrategy.enum';
import { AuthenticatedUser } from '../interfaces/authenticatedUser.interface';
import { JwtTokenPayload } from '../../token/interfaces/jwtTokenPayload.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, AuthenticationStrategy.ACCESS_TOKEN) {
    constructor(
        private readonly clsService: ClsService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_SECRET ?? "",
        });
    }

    async validate(payload: JwtTokenPayload): Promise<AuthenticatedUser> {
        const user = await this.userService.readByEmail(payload.email, true);

        if (!user) {
            throw new UnauthorizedException("Access denied");
        }

        this.clsService.set("companyId", user.CompanyId);
        this.clsService.set("isSystemRoot", user.IsSystemRoot);

        return {
            id: user.Id,
            name: user.Name,
            email: user.Email,
            isSystemRoot: user.IsSystemRoot,

            company: {
                id: user.Company.Id,
                name: user.Company.Name,
            }
        };
    }
}
