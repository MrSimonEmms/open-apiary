/**
 * app
 */

/* Node modules */

/* Third-party modules */

/* Files */

export interface ISystemMsg {
  msg: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  timeout?: number;
  multiLine?: boolean;
  vertical?: boolean;
}

export interface IConfirm {
  open: (message?: string, title?: string) => Promise<boolean>;
}
