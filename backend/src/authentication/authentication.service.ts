import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException, ForbiddenException, BadRequestException, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';

import { TokenService } from './token.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginCommandDto } from './dtos/loginCommand.dto';
import { ResetCommandDto } from './dtos/resetCommand.dto';
import { ForgotCommandDto } from './dtos/forgotCommand.dto';
import { AuthenticationTokenPair } from './types/AuthenticationTokenPair.type';

@Injectable()
export class AuthenticationService {
  constructor(private readonly tokenService: TokenService, private readonly prismaService: PrismaService) {}

  async login(command: LoginCommandDto): Promise<AuthenticationTokenPair> {
    const user = await this.prismaService.user.findUnique({
      where: {
        Email: command.email,
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

    const passwordMatches = await bcrypt.compare(command.password, user.Password);

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

  async forgot(command: ForgotCommandDto): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: {
        Email: command.email,
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

  async reset(command: ResetCommandDto): Promise<void> {
    if (command.newPassword !== command.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const payload = await this.tokenService.verifyPasswordResetToken(command.passwordResetToken);
    const user = await this.prismaService.user.findUnique({
      where: {
        Id: payload.sub,
        DeletedAt: null,
      },
    });

    if (!user || !user.PasswordResetToken) {
      throw new UnauthorizedException("Invalid password reset token");
    }

    const tokenMatches = await this.tokenService.comparePasswordResetToken(command.passwordResetToken, user.PasswordResetToken);

    if (!tokenMatches) {
      throw new UnauthorizedException("Invalid password reset token");
    }

    const newHashedPassword = await bcrypt.hash(command.newPassword, 12);

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
