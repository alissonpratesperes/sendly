import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { AuthenticationTokenPair } from './types/AuthenticationTokenPair.type';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    async generateAuthenticationTokenPair(userId: number, email: string): Promise<AuthenticationTokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXPIRATION as JwtSignOptions["expiresIn"] }
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: process.env.REFRESH_TOKEN_EXPIRATION as JwtSignOptions["expiresIn"] }
            )
        ]);

        return { accessToken, refreshToken };
    }

    async generateRefreshTokenHash(refreshToken: string): Promise<string> {
        const generatedHashedRefreshToken = await bcrypt.hash(refreshToken, 12);

        return generatedHashedRefreshToken;
    }

    async generatePasswordResetToken(userId: number, email: string): Promise<string> {
        const generatedPasswordResetToken = await this.jwtService.signAsync(
            { sub: userId, email },
            { secret: process.env.FORGOT_TOKEN_SECRET, expiresIn: process.env.FORGOT_TOKEN_EXPIRATION as JwtSignOptions["expiresIn"] },
        );

        return generatedPasswordResetToken;
    }
}
