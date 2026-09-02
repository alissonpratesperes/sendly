import * as bcrypt from 'bcrypt';
import { Injectable, ForbiddenException, BadRequestException, UnauthorizedException } from '@nestjs/common';

import { TokenService } from './token.service';
import { UserService } from 'src/user/user.service';
import { LoginCommandDto } from './dtos/loginCommand.dto';
import { ResetCommandDto } from './dtos/resetCommand.dto';
import { ForgotCommandDto } from './dtos/forgotCommand.dto';
import { AuthenticationTokenPair } from './types/AuthenticationTokenPair.type';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async login(command: LoginCommandDto): Promise<AuthenticationTokenPair> {
    const user = await this.userService.readByEmail(command.email, true);

    if(user.IsFirstAccess) {
      throw new BadRequestException("It's necessary to redefine the first password");
    }
    if(!await bcrypt.compare(command.password, user.Password)) {
      throw new ForbiddenException("Access denied");
    }

    const authenticatedUserTokenPair = await this.tokenService.generateAuthenticationTokenPair(user.Id, user.Email);
    const hashedRefreshToken = await this.tokenService.generateRefreshTokenHash(authenticatedUserTokenPair.refreshToken);

    await this.userService.updateUserRefreshToken(user.Id, hashedRefreshToken);

    return authenticatedUserTokenPair;
  }

  async logout(id: number): Promise<void> {
    await this.userService.updateUserRefreshToken(id, null);
  }

  async refresh(email: string, refreshToken: string): Promise<AuthenticationTokenPair> {
    const user = await this.userService.readByEmail(email, true);

    if(!user.HashedRefreshToken || !await this.tokenService.compareRefreshToken(refreshToken, user.HashedRefreshToken)) {
      throw new ForbiddenException("Access denied");
    }

    const authenticatedUserTokenPair = await this.tokenService.generateAuthenticationTokenPair(user.Id, user.Email);
    const hashedRefreshToken = await this.tokenService.generateRefreshTokenHash(authenticatedUserTokenPair.refreshToken);

    await this.userService.updateUserRefreshToken(user.Id, hashedRefreshToken);

    return authenticatedUserTokenPair;
  }

  async forgot(command: ForgotCommandDto): Promise<string> {
    const user = await this.userService.readByEmail(command.email, false);
    const generatedPasswordResetToken = await this.tokenService.generatePasswordResetToken(user.Id, user.Email);
    const hashedPasswordResetToken = await this.tokenService.generatePasswordResetTokenHash(generatedPasswordResetToken);

    await this.userService.startPasswordReset(user.Id, hashedPasswordResetToken);

    return generatedPasswordResetToken;
  }

  async reset(command: ResetCommandDto): Promise<void> {
    if (command.newPassword !== command.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const payload = await this.tokenService.verifyPasswordResetToken(command.passwordResetToken);
    const user = await this.userService.readByEmail(payload.email, false);

    if (!user.PasswordResetToken) {
      throw new UnauthorizedException("Invalid password reset token");
    }
    if (!await this.tokenService.comparePasswordResetToken(command.passwordResetToken, user.PasswordResetToken)) {
      throw new UnauthorizedException("Invalid password reset token");
    }

    const newHashedPassword = await bcrypt.hash(command.newPassword, 12);

    await this.userService.completePasswordReset(user.Id, newHashedPassword);
  }
}
