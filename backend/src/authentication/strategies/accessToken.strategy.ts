import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '../../user/user.service';
import { AuthenticationStrategy } from '../enums/authenticationStrategy.enum';
import { AuthenticatedUser } from '../interfaces/authenticatedUser.interface';
import { JwtTokenPayload } from '../../token/interfaces/jwtTokenPayload.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, AuthenticationStrategy.ACCESS_TOKEN) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_SECRET ?? "",
        });
    }

    async validate(payload: JwtTokenPayload): Promise<AuthenticatedUser> {
        const user = await this.userService.read(payload.sub);

        if (!user) {
            throw new UnauthorizedException("Access denied");
        }

        return {
            id: user.id,
            email: user.email,
            companyId: user.companyId,
            isSystemRoot: user.isSystemRoot
        };
    }
}
