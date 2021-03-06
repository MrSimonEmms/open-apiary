/**
 * auth.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';

/* Files */
import CanSetupStrategy from './strategies/canSetup.strategy';
import JWTStrategy from './strategies/jwt.strategy';
import UserModule from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    JWTStrategy,
    CanSetupStrategy,
  ],
})
export default class AuthModule {}
