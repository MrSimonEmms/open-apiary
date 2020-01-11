/**
 * user.controller.spec
 */

/* Node modules */
import {
  Body,
  Controller,
  HttpException,
  Post,
} from '@nestjs/common';

/* Files */
import User from '../entities/user.entity';
import UserService from '../services/user.service';
import { IUserLoginDTO } from '../interfaces/user';

@Controller('/api/user')
export default class UserController {
  constructor(
    protected readonly usersService: UserService,
  ) {}

  @Post('/auth')
  async authenticate(@Body() { emailAddress, password }: User) : Promise<IUserLoginDTO> {
    const user = await this.usersService.findByEmailAndPassword(emailAddress, password);

    if (!user) {
      throw new HttpException('Unauthorized', 401);
    }

    return {
      ...this.usersService.generateUserToken(user),
      user: this.usersService.toDTO(user),
    };
  }
}
