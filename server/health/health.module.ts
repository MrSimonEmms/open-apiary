/**
 * health.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

/* Files */
import HealthController from './controllers/health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export default class HealthModule {}
