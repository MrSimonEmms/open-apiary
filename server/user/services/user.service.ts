/**
 * user.server
 */

/* Node modules */

/* Third-party modules */
import * as jwt from 'jsonwebtoken';
import ms from 'ms';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

/* Files */
import User from '../entities/user.entity';
import { IUserDTO, IUserTokenPayload } from '../interfaces/user';

@Injectable()
export default class UserService extends TypeOrmCrudService<User> {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) protected repo,
  ) {
    super(repo);
  }

  countUsers() : Promise<number> {
    return this.repo.count();
  }

  async deleteUser(id: string | number) : Promise<void> {
    await this.repo.delete(id);
  }

  async findByEmailAndPassword(emailAddress: string, password: string) : Promise<User | void> {
    const user = await this.repo.findOne({
      emailAddress,
    });

    if (!user) {
      return undefined;
    }

    if (!user.verifyPassword(password)) {
      return undefined;
    }

    return user;
  }

  generateUserToken(user: User) : { expires: Date, token: string } {
    /* Get the expiry time for public consumption */
    const expiresIn = this.configService.get<string>('jwt.expiry');
    const expires = new Date(Date.now() + ms(expiresIn));
    expires.setMilliseconds(0); // JWT only works in whole seconds

    const payload: IUserTokenPayload = {
      id: user.id,
      emailAddress: user.emailAddress,
    };

    return {
      expires,
      token: jwt.sign(payload, this.configService.get('jwt.secret'), {
        expiresIn,
        issuer: this.configService.get('jwt.issuer'),
        notBefore: 0,
      }),
    };
  }

  toDTO(user: User) : IUserDTO {
    const dto = {
      ...user,
    };

    delete dto.password;

    return dto;
  }
}
