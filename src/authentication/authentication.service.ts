import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException, ForbiddenException, BadRequestException, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';

import { ResetDto } from './dtos/reset.dto';
import { ForgotDto } from './dtos/forgot.dto';
import { TokenService } from './token.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticationDto } from './dtos/authentication.dto';
import { AuthenticationTokenPair } from './types/AuthenticationTokenPair.type';

@Injectable()
export class AuthenticationService {
  constructor(private readonly tokenService: TokenService, private readonly prismaService: PrismaService) {}

  async login(authenticationDto: AuthenticationDto): Promise<AuthenticationTokenPair> {
    const user = await this.prismaService.user.findUnique({
      where: {
        Email: authenticationDto.email,
        DeletedAt: null,
      },
    });

    if(!user) {
      throw new NotFoundException("User not found");
    }
    if(user.PasswordResetToken) {
      throw new UnprocessableEntityException("It's not possible to login when redefining password");
    }
    if(user.IsFirstAccess) {
      throw new BadRequestException("It's necessary to redefine the first password");
    }

    const passwordMatches = await bcrypt.compare(authenticationDto.password, user.Password);

    if(!passwordMatches) {
      throw new ForbiddenException("Access denied");
    }

    const authenticatedUserTokenPair = await this.tokenService.generateAuthenticationTokenPair(user.Id, user.Email);
    const hashedRefreshToken = await this.tokenService.generateRefreshTokenHash(authenticatedUserTokenPair.refreshToken);

    await this.prismaService.user.update({
      where: {
        Id: user.Id,
      },
      data: {
        HashedRefreshToken: hashedRefreshToken,
      },
    });

    return authenticatedUserTokenPair;
  }

  async logout(userId: number): Promise<void> {
    await this.prismaService.user.update({
      where: {
        Id: userId,
      },
      data: {
        HashedRefreshToken: null,
      },
    });
  }

  async refresh(userId: number, refreshToken: string): Promise<AuthenticationTokenPair> {
    const user = await this.prismaService.user.findUnique({
      where: {
        Id: userId,
        PasswordResetToken: null,
        DeletedAt: null,
      },
    });

    if(!user || !user.HashedRefreshToken) {
      throw new ForbiddenException("Access denied");
    }

    const refreshTokenMatches = await this.tokenService.compareRefreshToken(refreshToken, user.HashedRefreshToken);

    if(!refreshTokenMatches) {
      throw new ForbiddenException("Access denied");
    }

    const authenticatedUserTokenPair = await this.tokenService.generateAuthenticationTokenPair(user.Id, user.Email);
    const hashedRefreshToken = await this.tokenService.generateRefreshTokenHash(authenticatedUserTokenPair.refreshToken);

    await this.prismaService.user.update({
      where: {
        Id: user.Id,
      },
      data: {
        HashedRefreshToken: hashedRefreshToken,
      },
    });

    return authenticatedUserTokenPair;
  }

  async forgot(forgotDto: ForgotDto): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: {
        Email: forgotDto.email,
        DeletedAt: null,
      },
    });

    if(!user) {
      throw new NotFoundException("User not found");
    }

    const generatedPasswordResetToken = await this.tokenService.generatePasswordResetToken(user.Id, user.Email);
    const hashedPasswordResetToken = await this.tokenService.generatePasswordResetTokenHash(generatedPasswordResetToken);

    await this.prismaService.user.update({
      where: {
        Id: user.Id,
      },
      data: {
        HashedRefreshToken: null,
        PasswordResetToken: hashedPasswordResetToken,
      },
    });

    return generatedPasswordResetToken;
  }

  async reset(passwordResetToken: string, resetDto: ResetDto): Promise<void> {
    if (resetDto.newPassword !== resetDto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const payload = await this.tokenService.verifyPasswordResetToken(passwordResetToken);
    const user = await this.prismaService.user.findUnique({
      where: {
        Id: payload.sub,
        DeletedAt: null,
      },
    });

    if (!user || !user.PasswordResetToken) {
      throw new UnauthorizedException("Invalid password reset token");
    }

    const tokenMatches = await this.tokenService.comparePasswordResetToken(passwordResetToken, user.PasswordResetToken);

    if (!tokenMatches) {
      throw new UnauthorizedException("Invalid password reset token");
    }

    const newHashedPassword = await bcrypt.hash(resetDto.newPassword, 12);

    await this.prismaService.user.update({
      where: {
        Id: user.Id,
      },
      data: {
        Password: newHashedPassword,
        HashedRefreshToken: null,
        PasswordResetToken: null,
        IsFirstAccess: false,
      },
    });
  }
}
