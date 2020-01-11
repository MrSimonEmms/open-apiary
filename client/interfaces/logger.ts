/**
 * logger
 */

/* Node modules */

/* Third-party modules */
import pino from 'pino';

/* Files */

export interface IKeyValue<V = any> {
  [key: string]: V;
}

export interface ILoggerFn {
  (msg: string, obj?: IKeyValue, ...args: any[]) : void;
}

export interface ILogger {
  logId?: string;
  fatal: ILoggerFn;
  error: ILoggerFn;
  warn: ILoggerFn;
  info: ILoggerFn;
  debug: ILoggerFn;
  trace: ILoggerFn;
  child(bindings: pino.Bindings): ILogger;
}
