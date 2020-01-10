/**
 * nuxt.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';

/* Files */
import NuxtController from './nuxt.controller';

@Module({
  controllers: [NuxtController],
})
export default class NuxtModule {}
