import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';

import { ResetDto } from './dtos/reset.dto';
import { ForgotDto } from './dtos/forgot.dto';
import { IsPublic } from './decorators/isPublic.decorator';
import { AuthenticationDto } from './dtos/authentication.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuthenticationService } from './authentication.service';
import { GetCurrentUser } from './decorators/getCurrentUser.decorator';
import { GetCurrentUserId } from './decorators/getCurrentUserId.decorator';
import { AuthenticationTokenPair } from './types/AuthenticationTokenPair.type';

@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @IsPublic()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() authenticationDto: AuthenticationDto): Promise<AuthenticationTokenPair> {
    return this.authenticationService.login(authenticationDto);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number): Promise<void> {
    return this.authenticationService.logout(userId);
  }

  @IsPublic()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refresh(@GetCurrentUserId() userId: number, @GetCurrentUser("refreshToken") refreshToken: string): Promise<AuthenticationTokenPair> {
    return this.authenticationService.refresh(userId, refreshToken);
  }

  @IsPublic()
  @Post("forgot")
  @HttpCode(HttpStatus.OK)
  async forgot(@Body() forgotDto: ForgotDto): Promise<string> {
    return this.authenticationService.forgot(forgotDto);
  }

  @IsPublic()
  @Post("reset/:passwordResetToken")
  @HttpCode(HttpStatus.NO_CONTENT)
  async reset(@Param("passwordResetToken") passwordResetToken: string, @Body() resetDto: ResetDto): Promise<void> {
    return this.authenticationService.reset(passwordResetToken, resetDto);
  }
}
