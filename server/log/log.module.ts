/**
 * log.module
 */

/* Node modules */

/* Third-party modules */
import { Module } from '@nestjs/common';

/* Files */
import LogController from './log.controller';

@Module({
  controllers: [LogController],
})
export default class LogModule {}
