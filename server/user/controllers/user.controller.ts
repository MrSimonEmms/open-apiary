/**
 * user.controller.spec
 */

/* Node modules */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus, Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';

/* Files */
import User from '../entities/user.entity';
import UserService from '../services/user.service';
import { IAuthInputDTO, IUserLoginDTO } from '../interfaces/user';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: [
      'createOneBase',
      'deleteOneBase',
      'getManyBase',
      'getOneBase',
      'replaceOneBase',
    ],
  },
  params: {
    id: {
      primary: true,
      disabled: true,
    },
  },
  query: {
    exclude: [
      'tempPassword',
      'password',
    ],
  },
})
@CrudAuth({
  filter: (req: any) => {
    if (req.user) {
      return {
        id: req.user.id,
      };
    }
    return {};
  },
})
@Controller('/api/user')
export default class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  get base(): CrudController<User> {
    return this;
  }

  @UseGuards(AuthGuard([
    'canSetup',
    'jwt',
  ]))
  @Override('createOneBase')
  createUser(@Request() { user }, @ParsedRequest() crudReq: CrudRequest, @ParsedBody() dto: User) {
    /* If authenticated using "canSetup", force password change */
    dto.changeOnLogin = !user.canSetup;

    return this.base.createOneBase(crudReq, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Override('getOneBase')
  getUser(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Override('replaceOneBase')
  updateUser(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User) {
    return this.base.replaceOneBase(req, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(CrudRequestInterceptor)
  @Delete('/:id')
  async delete(@Param('id') id: string) : Promise<void> {
    await this.service.deleteUser(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(CrudRequestInterceptor)
  @Get('/list')
  async list(@ParsedRequest() req: CrudRequest) {
    /* Remove the CrudAuth filter */
    req.parsed.search.$and.shift();

    return this.base.getManyBase(req);
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Get('/setup')
  async setup() : Promise<{ isSetup: boolean }> {
    const users = await this.service.countUsers();

    return {
      isSetup: users > 0,
    };
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Post('/auth')
  async authenticate(@Body() { emailAddress, password }: IAuthInputDTO) : Promise<IUserLoginDTO> {
    const user = await this.service.findByEmailAndPassword(emailAddress, password);

    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return {
      ...this.service.generateUserToken(user),
      user: this.service.toDTO(user),
    };
  }
}
