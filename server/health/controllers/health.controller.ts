/**
 * health.controller
 */

/* Node modules */

/* Third-party modules */
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckError,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { MessengerService } from 'nestjs-messenger';
import { PinoLogger } from 'nestjs-pino';

/* Files */

@Controller('/api/health')
export default class HealthController {
  constructor(
    protected db: TypeOrmHealthIndicator,
    protected health: HealthCheckService,
    protected logger: PinoLogger,
    protected messageService: MessengerService,
  ) {}

  @Get('/')
  @HealthCheck()
  healthCheck() {
    const tasks = [
      async () => this.db.pingCheck('database', {
        timeout: 300,
      }),
    ];

    if (this.messageService.emailIsConfigured()) {
      tasks.push(async () => {
        try {
          await this.messageService.verifyEmailConnection();

          return {
            emailTransport: {
              status: 'up',
            },
          };
        } catch (err) {
          this.logger.error({
            err,
          }, 'Email transport health check failed');

          throw new HealthCheckError('Email transport failed', {
            emailTransport: {
              status: 'down',
              message: 'Failed to connect to message server',
            },
          });
        }
      });
    }

    return this.health.check(tasks);
  }
}
