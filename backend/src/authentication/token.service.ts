import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { JwtTokenPayload } from './interfaces/jwtTokenPayload.interface';
import { AuthenticationTokenPair } from './types/AuthenticationTokenPair.type';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    private getExpiresIn(expiresInValueFromEnv: string | undefined): JwtSignOptions["expiresIn"] {
        if (!expiresInValueFromEnv) {
            throw new InternalServerErrorException("Environment variable not defined");
        }

        return expiresInValueFromEnv as JwtSignOptions["expiresIn"];
    }

    private hashToken(token: string): string {
        return crypto.createHash("sha256").update(token).digest("hex");
    }

    private hashWithBcrypt(token: string): Promise<string> {
        return bcrypt.hash(token, 12);
    }

    private compareWithBcrypt(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }

    async generateAuthenticationTokenPair(userId: number, email: string): Promise<AuthenticationTokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: this.getExpiresIn(process.env.ACCESS_TOKEN_EXPIRATION) }
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: this.getExpiresIn(process.env.REFRESH_TOKEN_EXPIRATION) }
            )
        ]);

        return { accessToken, refreshToken };
    }

    generateRefreshTokenHash(refreshToken: string): Promise<string> {
        return this.hashWithBcrypt(refreshToken);
    }

    async generatePasswordResetToken(userId: number, email: string): Promise<string> {
        return this.jwtService.signAsync(
            { sub: userId, email },
            { secret: process.env.FORGOT_TOKEN_SECRET, expiresIn: this.getExpiresIn(process.env.FORGOT_TOKEN_EXPIRATION) },
        );
    }

    async verifyPasswordResetToken(token: string): Promise<JwtTokenPayload> {
        try {
            return await this.jwtService.verifyAsync<JwtTokenPayload>(token, { secret: process.env.FORGOT_TOKEN_SECRET });
        } catch {
            throw new UnauthorizedException("Invalid or expired password reset token");
        }
    }

    compareRefreshToken(refreshToken: string, hashedRefreshToken: string): Promise<boolean> {
        return this.compareWithBcrypt(refreshToken, hashedRefreshToken);
    }

    generatePasswordResetTokenHash(passwordResetToken: string): Promise<string> {
        return this.hashWithBcrypt(this.hashToken(passwordResetToken));
    }

    comparePasswordResetToken(token: string, hashedToken: string): Promise<boolean> {
        return this.compareWithBcrypt(this.hashToken(token), hashedToken);
    }
}
