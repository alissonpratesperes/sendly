import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { IsPublic } from './decorators/isPublic.decorator';
import { AuthenticationDto } from './dtos/authentication.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
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
  @UseGuards(AccessTokenGuard)
  async logout(@GetCurrentUserId() userId: number) {
    return this.authenticationService.logout(userId);
  }

  @IsPublic()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refresh(@GetCurrentUserId() userId: number, @GetCurrentUser("refreshToken") refreshToken: string) {
    return this.authenticationService.refresh(userId, refreshToken);
  }
}
