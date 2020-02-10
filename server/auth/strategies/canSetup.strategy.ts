/**
 * canSetup.strategy
 *
 * This strategy checks that no users have been
 * configured yet.
 */

/* Node modules */

/* Third-party modules */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

/* Files */
import UserService from '../../user/services/user.service';

@Injectable()
export default class CanSetupStrategy extends PassportStrategy(Strategy, 'canSetup') {
  constructor(
    protected readonly userService: UserService,
  ) {
    super();
  }

  async validate() {
    const userTotal = await this.userService.countUsers();

    return {
      canSetup: userTotal === 0,
    };
  }
}
