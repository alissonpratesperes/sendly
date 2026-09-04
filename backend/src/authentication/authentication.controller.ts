import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { LoginCommandDto } from './dtos/loginCommand.dto';
import { ResetCommandDto } from './dtos/resetCommand.dto';
import { IsPublic } from './decorators/isPublic.decorator';
import { ForgotCommandDto } from './dtos/forgotCommand.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuthenticationService } from './authentication.service';
import { CurrentUser } from './interfaces/currentUser.interface';
import { GetCurrentUser } from './decorators/getCurrentUser.decorator';
import { AuthenticationTokenPair } from './types/AuthenticationTokenPair.type';

@Controller("authentication")
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}

  @IsPublic()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() command: LoginCommandDto): Promise<AuthenticationTokenPair> {
    return this.authenticationService.login(command);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUser(["id"]) id: number): Promise<void> {
    return this.authenticationService.logout(id);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refresh(@GetCurrentUser(["email", "refreshToken"]) user: Pick<CurrentUser, "email" | "refreshToken">): Promise<AuthenticationTokenPair> {
    return this.authenticationService.refresh(user.email, user.refreshToken);
  }

  @IsPublic()
  @Post("forgot")
  @HttpCode(HttpStatus.OK)
  async forgot(@Body() command: ForgotCommandDto): Promise<string> {
    return this.authenticationService.forgot(command);
  }

  @IsPublic()
  @Patch("reset")
  @HttpCode(HttpStatus.NO_CONTENT)
  async reset(@Query('passwordResetToken') query: string, @Body() command: ResetCommandDto): Promise<void> {
    return this.authenticationService.reset(query, command);
  }
}
