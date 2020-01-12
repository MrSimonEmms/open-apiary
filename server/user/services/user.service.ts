/**
 * user.server
 */

/* Node modules */

/* Third-party modules */
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ms from 'ms';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

/* Files */
import User from '../entities/user.entity';
import { IUserDTO, IUserTokenPayload } from '../interfaces/user';

@Injectable()
export default class UserService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) protected userRepo: Repository<User>,
  ) {}

  async findByEmailAndPassword(emailAddress: string, password: string) : Promise<User | void> {
    const user = await this.userRepo.findOne({
      emailAddress,
    });

    if (!user) {
      return undefined;
    }

    if (!await bcrypt.compare(password, user.password)) {
      return undefined;
    }

    return user;
  }

  findById(id: number) : Promise<User | void> {
    return this.userRepo.findOne(id);
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
