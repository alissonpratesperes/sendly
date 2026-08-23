import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AuthenticationDto } from './dtos/authentication.dto';
import { AuthenticationTokenPair } from './types/AuthenticationTokenPair.type';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService) {}

  async login(authenticationDto: AuthenticationDto): Promise<AuthenticationTokenPair> {
    const user = await this.prismaService.user.findUnique({ where: { Email: authenticationDto.email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bothPasswordMatches = await bcrypt.compare(authenticationDto.password, user.Password);

    if (!bothPasswordMatches) {
      throw new ForbiddenException('Access denied');
    }

    const generatedTokensForAuthenticatedUser = await this.getUserTokens(user.Id, user.Email);

    await this.updateRefreshTokenHash(user.Id, generatedTokensForAuthenticatedUser.refreshToken);

    return generatedTokensForAuthenticatedUser;
  }

  async logout(userId: number) {
    await this.prismaService.user.update({
      where: { Id: userId, HashedRefreshToken: { not: null } },
      data: { HashedRefreshToken: null },
    });
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({ where: { Id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.HashedRefreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const bothRefreshTokenMatches = await bcrypt.compare(refreshToken, user.HashedRefreshToken);

    if (!bothRefreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }

    const generatedTokensForAuthenticatedUser = await this.getUserTokens(user.Id, user.Email);

    await this.updateRefreshTokenHash(user.Id, generatedTokensForAuthenticatedUser.refreshToken);

    return generatedTokensForAuthenticatedUser;
  }

  private async getUserTokens(userId: number, email: string): Promise<AuthenticationTokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
            { sub: userId, email },
            { secret: process.env.ACCESS_TOKEN_DECRYPT_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME as JwtSignOptions['expiresIn'] }
        ),
        this.jwtService.signAsync(
            { sub: userId, email },
            { secret: process.env.REFRESH_TOKEN_DECRYPT_SECRET, expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME as JwtSignOptions['expiresIn'] }
        )
    ]);

    return { accessToken, refreshToken }
  }

  private async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    await this.prismaService.user.update({
      where: { Id: userId },
      data: { HashedRefreshToken: hashedRefreshToken },
    });
  }
}
