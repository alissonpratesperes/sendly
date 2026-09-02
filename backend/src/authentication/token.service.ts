import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtTokenPayload } from './interfaces/jwtTokenPayload.interface';
import { AuthenticationTokenPair } from './types/AuthenticationTokenPair.type';
import { requireEnvironmentVariable } from '../common/utils/requireEnvironmentVariable.util';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    private readonly accessTokenConfig = this.createTokenConfig("ACCESS_TOKEN_SECRET", "ACCESS_TOKEN_EXPIRATION");
    private readonly refreshTokenConfig = this.createTokenConfig("REFRESH_TOKEN_SECRET", "REFRESH_TOKEN_EXPIRATION");
    private readonly forgotTokenConfig = this.createTokenConfig("FORGOT_TOKEN_SECRET", "FORGOT_TOKEN_EXPIRATION");

    private createTokenConfig(secretVariable: string, expirationVariable: string): JwtSignOptions {
        return {
            secret: requireEnvironmentVariable(secretVariable),
            expiresIn: requireEnvironmentVariable(expirationVariable) as JwtSignOptions["expiresIn"],
        };
    }

    private hashToken(token: string): string {
        return crypto.createHash("sha256").update(token).digest("hex");
    }

    async generateAuthenticationTokenPair(userId: number, email: string): Promise<AuthenticationTokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email }, this.accessTokenConfig),
            this.jwtService.signAsync({ sub: userId, email }, this.refreshTokenConfig),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    generateRefreshTokenHash(refreshToken: string): Promise<string> {
        return bcrypt.hash(refreshToken, 12);
    }

    async generatePasswordResetToken(userId: number, email: string): Promise<string> {
        return this.jwtService.signAsync({ sub: userId, email }, this.forgotTokenConfig);
    }

    async verifyPasswordResetToken(token: string): Promise<JwtTokenPayload> {
        try {
            return await this.jwtService.verifyAsync<JwtTokenPayload>(token, { secret: this.forgotTokenConfig.secret });
        } catch {
            throw new UnauthorizedException("Invalid or expired password reset token");
        }
    }

    compareRefreshToken(refreshToken: string, hashedRefreshToken: string): Promise<boolean> {
        return bcrypt.compare(refreshToken, hashedRefreshToken);
    }

    generatePasswordResetTokenHash(passwordResetToken: string): Promise<string> {
        return bcrypt.hash(this.hashToken(passwordResetToken), 12);
    }

    comparePasswordResetToken(token: string, hashedToken: string): Promise<boolean> {
        return bcrypt.compare(this.hashToken(token), hashedToken);
    }
}
