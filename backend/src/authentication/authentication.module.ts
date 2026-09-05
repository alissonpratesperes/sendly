import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    UserModule,
    TokenModule,
  ],
  controllers: [
    AuthenticationController,
  ],
  providers: [
    AuthenticationService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthenticationModule {}
