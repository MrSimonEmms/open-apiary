/**
 * health.controller
 */

/* Node modules */

/* Third-party modules */
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

/* Files */

@Controller('/api/health')
export default class HealthController {
  constructor(
    protected db: TypeOrmHealthIndicator,
    protected health: HealthCheckService,
  ) {}

  @Get('/')
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      async () => this.db.pingCheck('database', {
        timeout: 300,
      }),
    ]);
  }
}
