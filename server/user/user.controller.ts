/**
 * user.controller.spec
 */

/* Node modules */
import { Controller, Get } from '@nestjs/common';

/* Files */

@Controller('user')
export default class UserController {
  @Get()
  findAll() {
    return 'hello world';
  }
}
