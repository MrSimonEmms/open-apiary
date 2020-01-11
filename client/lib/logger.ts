/**
 * logger
 */

/* Node modules */

/* Third-party modules */
import pino from 'pino';
import uuid from 'uuid';

/* Files */
import { IKeyValue, ILoggerFn, ILogger } from '../interfaces/logger';

export default class Logger implements ILogger {
  fatal!: ILoggerFn;

  error!: ILoggerFn;

  warn!: ILoggerFn;

  info!: ILoggerFn;

  debug!: ILoggerFn;

  trace!: ILoggerFn;

  constructor(protected inst: pino.Logger, public logId?: string) {
    /* Define the class methods */
    Object.keys(pino.levels.values)
      .forEach((level) => {
        Object.defineProperty(this, level, {
          get: () => this.factory(level),
        });
      });
  }

  /**
   * Child
   *
   * Wraps the pino child method, returning a new
   * instance of the Logger with any additional values
   * set.
   *
   * @param {pino.Bindings} bindings
   * @return {ILogger}
   */
  child(bindings: pino.Bindings) : ILogger {
    return new Logger(this.inst.child(bindings), this.logId);
  }

  /**
   * Factory
   *
   * Generates the function to send logs as a specific
   * level.
   *
   * @param {string} level
   * @return {ILoggerFn}
   */
  protected factory(level: string): ILoggerFn {
    return (msg: string, obj: IKeyValue = {}, ...args: any[]) => {
      // eslint-disable-next-line no-param-reassign
      obj.correlationId = this.getLogId() ?? uuid.v4();

      this.inst[level](obj, msg, ...args);
    };
  }

  protected getLogId() : string | undefined {
    return this.logId;
  }

  /**
   * Get Debug Level
   *
   * Retrieves the debug value from localStorage then converts
   * it into a log level.
   *
   * @param {string} key
   * @param {RegExp | null} pattern
   * @return {string}
   */
  static getDebugLevel(key: string, pattern: RegExp | null = null) : string {
    const rawValue = Logger.getDebugValue(key, pattern);

    if (pattern === null) {
      /* No pattern - just return */
      return rawValue;
    }

    /* Treat a pattern as a tuple */
    const [, value] = rawValue.split(pattern);

    /* Mimic the "debug" functionality */
    if (value === '*') {
      return 'trace';
    }

    return value;
  }

  /**
   * Get Debug Value
   *
   * Get the debug value stored in the localStorage
   * object. If a pattern is given, it
   *
   * This is designed as a port of the "debug" library
   * functionality
   *
   * @param {string} key
   * @param {RegExp | null} pattern
   * @return {string}
   */
  static getDebugValue(key: string, pattern: RegExp | null = null) : string {
    const storeValue = localStorage[key] || '';

    if (pattern === null) {
      return storeValue;
    }
    const format = new RegExp(pattern);

    if (format.test(storeValue)) {
      return storeValue;
    }

    return '';
  }
}
