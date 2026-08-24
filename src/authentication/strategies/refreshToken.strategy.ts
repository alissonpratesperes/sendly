import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtTokenPayload } from '../interfaces/jwtTokenPayload.interface';
import { AuthenticationStrategy } from '../enums/authenticationStrategy.enum';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, AuthenticationStrategy.RefreshToken) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.REFRESH_TOKEN_SECRET ?? "",
            passReqToCallback: true,
        });
    }

    validate(request: Request, payload: JwtTokenPayload) {
        const refreshToken = request.get("Authorization")?.replace("Bearer ", "").trim();

        return {
            ...payload,
            refreshToken
        };
    }
}
