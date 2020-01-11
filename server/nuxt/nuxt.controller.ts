/**
 * nuxt.controller
 */

/* Node modules */

/* Third-party modules */
import {
  Controller, Get, Request, Response,
} from '@nestjs/common';
import { Builder, Nuxt } from 'nuxt';

/* Files */
const config = require('../../nuxt.config');

@Controller()
export default class NuxtController {
  protected nuxt: Nuxt | void;

  constructor() {
    if (process.env.IS_NUXT_ENABLED) {
      this.nuxt = new Nuxt(config);
      this.nuxt.ready()
        .then(() => {
          new Builder(this.nuxt).build();
        });
    } else if (process.env.IS_NUXT_DISABLED !== 'true') {
      config.dev = false;
      config.buildModules = []; // These are running when they shouldn't be
      this.nuxt = new Nuxt(config);
    }
  }

  @Get('*')
  async root(@Request() req, @Response() res) {
    if (this.nuxt) {
      await this.nuxt.render(req, res);
    } else {
      res.send('Nuxt is disabled');
    }
  }
}
