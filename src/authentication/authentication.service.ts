import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { ForgotDto } from './dtos/forgot.dto';
import { TokenService } from './token.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticationDto } from './dtos/authentication.dto';
import { AuthenticationTokenPair } from './types/AuthenticationTokenPair.type';

@Injectable()
export class AuthenticationService {
  constructor(private readonly tokenService: TokenService, private readonly prismaService: PrismaService) {}

  async login(authenticationDto: AuthenticationDto): Promise<AuthenticationTokenPair> {
    const user = await this.prismaService.user.findUnique({ where: { Email: authenticationDto.email, DeletedAt: null } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const bothPasswordMatches = await bcrypt.compare(authenticationDto.password, user.Password);

    if (!bothPasswordMatches) {
      throw new ForbiddenException("Access denied");
    }

    const authenticatedUserTokenPair = await this.tokenService.generateAuthenticationTokenPair(user.Id, user.Email);
    const hashedRefreshToken = await this.tokenService.generateRefreshTokenHash(authenticatedUserTokenPair.refreshToken);

    await this.prismaService.user.update({
      where: { Id: user.Id },
      data: { HashedRefreshToken: hashedRefreshToken }
    });

    return authenticatedUserTokenPair;
  }

  async logout(userId: number) {
    await this.prismaService.user.update({
      where: { Id: userId },
      data: { HashedRefreshToken: null },
    });
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({ where: {
      Id: userId,
      DeletedAt: null
    } });

    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.HashedRefreshToken) {
      throw new ForbiddenException("Access denied");
    }

    const bothRefreshTokenMatches = await bcrypt.compare(refreshToken, user.HashedRefreshToken);

    if (!bothRefreshTokenMatches) {
      throw new ForbiddenException("Access denied");
    }

    const authenticatedUserTokenPair = await this.tokenService.generateAuthenticationTokenPair(user.Id, user.Email);
    const hashedRefreshToken = await this.tokenService.generateRefreshTokenHash(authenticatedUserTokenPair.refreshToken);

    await this.prismaService.user.update({
      where: { Id: user.Id },
      data: { HashedRefreshToken: hashedRefreshToken }
    });

    return authenticatedUserTokenPair;
  }

  async forgot(forgotDto: ForgotDto) {
    const user = await this.prismaService.user.findUnique({ where: { Email: forgotDto.email, DeletedAt: null } });

    if(!user) {
      throw new NotFoundException("User not found");
    }

    const generatedPasswordResetToken = await this.tokenService.generatePasswordResetToken(user.Id, user.Email);

    await this.prismaService.user.update({
      where: { Id: user.Id },
      data: { PasswordResetToken: generatedPasswordResetToken, HashedRefreshToken: null }
    });

    return generatedPasswordResetToken;
  }
}
