/**
 * user.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

/* Files */
import UserController from './controllers/user.controller';
import UserService from './services/user.service';
import User from './entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export default class UserModule {}
