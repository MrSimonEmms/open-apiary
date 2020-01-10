/**
 * app.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';

/* Files */
import NuxtModule from './nuxt/nuxt.module';
import UserModule from './user/user.module';

@Module({
  imports: [
    UserModule,
    NuxtModule, /* This must be last */
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}
