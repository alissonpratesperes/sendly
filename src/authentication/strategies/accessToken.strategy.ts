import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { JwtTokenPayload } from '../interfaces/jwtTokenPayload.interface';
import { AuthenticationStrategy } from '../enums/authenticationStrategy.enum';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, AuthenticationStrategy.AccessToken) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_DECRYPT_SECRET ?? "",
        });
    }

    validate(payload: JwtTokenPayload) {
        return payload;
    }
}
