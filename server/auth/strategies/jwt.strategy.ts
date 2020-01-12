/**
 * jwt.strategy
 */

/* Node modules */

/* Third-party modules */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/* Files */
import UserService from '../../user/services/user.service';
import { IUserDTO, IUserTokenPayload } from '../../user/interfaces/user';

@Injectable()
export default class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    protected readonly userService: UserService,
    protected readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwt.secret'),
      issuer: config.get('jwt.issuer'),
    });
  }

  async validate({ id }: IUserTokenPayload) : Promise<IUserDTO | void> {
    const user = await this.userService.findById(id);

    if (!user) {
      return undefined;
    }

    return this.userService.toDTO(user);
  }
}
