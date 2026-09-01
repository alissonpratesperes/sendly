import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtTokenPayload } from './interfaces/jwtTokenPayload.interface';
import { AuthenticationTokenPair } from './types/AuthenticationTokenPair.type';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    private readonly accessTokenConfig: JwtSignOptions = {
        secret: this.requireEnvironmentVariable("ACCESS_TOKEN_SECRET"),
        expiresIn: this.getExpiresIn(this.requireEnvironmentVariable("ACCESS_TOKEN_EXPIRATION")),
    };
    private readonly refreshTokenConfig: JwtSignOptions = {
        secret: this.requireEnvironmentVariable("REFRESH_TOKEN_SECRET"),
        expiresIn: this.getExpiresIn(this.requireEnvironmentVariable("REFRESH_TOKEN_EXPIRATION")),
    };
    private readonly forgotTokenConfig: JwtSignOptions = {
        secret: this.requireEnvironmentVariable("FORGOT_TOKEN_SECRET"),
        expiresIn: this.getExpiresIn(this.requireEnvironmentVariable("FORGOT_TOKEN_EXPIRATION")),
    };

    private requireEnvironmentVariable(variable: string): string {
        const value = process.env[variable];

        return !value ? (() => { throw new Error(`'${variable}' is not defined`); })() : value;
    }

    private getExpiresIn(value: string): JwtSignOptions["expiresIn"] {
        return value as JwtSignOptions["expiresIn"];
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
            this.jwtService.signAsync({ sub: userId, email }, this.accessTokenConfig),
            this.jwtService.signAsync({ sub: userId, email }, this.refreshTokenConfig)
        ]);

        return { accessToken, refreshToken };
    }

    generateRefreshTokenHash(refreshToken: string): Promise<string> {
        return this.hashWithBcrypt(refreshToken);
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
        return this.compareWithBcrypt(refreshToken, hashedRefreshToken);
    }

    generatePasswordResetTokenHash(passwordResetToken: string): Promise<string> {
        return this.hashWithBcrypt(this.hashToken(passwordResetToken));
    }

    comparePasswordResetToken(token: string, hashedToken: string): Promise<boolean> {
        return this.compareWithBcrypt(this.hashToken(token), hashedToken);
    }
}
