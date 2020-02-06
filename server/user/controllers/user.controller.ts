/**
 * user.controller.spec
 */

/* Node modules */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/* Files */
import UserService from '../services/user.service';
import { IAuthInputDTO, IUserLoginDTO } from '../interfaces/user';

@Controller('/api/user')
export default class UserController {
  constructor(
    protected readonly usersService: UserService,
  ) {}

  @Post('/auth')
  async authenticate(@Body() { emailAddress, password }: IAuthInputDTO) : Promise<IUserLoginDTO> {
    const user = await this.usersService.findByEmailAndPassword(emailAddress, password);

    if (!user) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    return {
      ...this.usersService.generateUserToken(user),
      user: this.usersService.toDTO(user),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  user(@Request() req) {
    return req.user;
  }
}
