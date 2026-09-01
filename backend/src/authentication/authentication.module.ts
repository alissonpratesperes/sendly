import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TokenService } from './token.service';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthenticationController],
  providers: [TokenService, AuthenticationService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthenticationModule {}
