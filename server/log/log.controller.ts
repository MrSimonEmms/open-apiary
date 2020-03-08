/**
 * log.controller
 */

/* Node modules */

/* Third-party modules */
import {
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import pino from 'pino';

/* Files */

@Controller()
export default class LogController {
  constructor(protected logger: PinoLogger) {}

  @Post('/api/log')
  @HttpCode(204)
  receiveLog(@Body() { logs }: {
    logs: {
      id: string;
      level: pino.Level;
      logEvent: pino.LogEvent;
    }[],
  }) {
    if (!Array.isArray(logs)) {
      this.logger.warn({ logs }, 'Unknown logs received');
      return;
    }

    logs.forEach(({ level, logEvent }) => {
      /* Convert the logEvent into the log format */
      this.logger.trace({
        level,
        logEvent,
      }, 'New client log message received');

      const obj : { [key: string]: any } = {};

      const iterator = (msg) => {
        try {
          if (typeof msg === 'string') {
            obj.msg = msg;
          } else {
            Object.keys(msg)
              .forEach((key) => {
                obj[key] = msg[key];
              });
          }
        } catch (err) {
          this.logger.warn({
            err,
            msg,
          }, 'Unable to parse client log event');
        }
      };

      logEvent.bindings.forEach(iterator);
      logEvent.messages.forEach(iterator);

      this.logger[level]({
        ...obj,
        time: logEvent.ts,
      });
    });
  }
}
