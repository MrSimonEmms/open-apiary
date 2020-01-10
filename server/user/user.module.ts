/**
 * user.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';

/* Files */
import UserController from './user.controller';

@Module({
  controllers: [UserController],
})
export default class UserModule {}
