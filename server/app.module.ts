/**
 * app.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/* Files */
import configuration from './config/configuration';
import NuxtModule from './nuxt/nuxt.module';
import UserModule from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    UserModule,
    NuxtModule, /* This must be last */
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}
