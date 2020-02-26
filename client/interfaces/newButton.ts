/**
 * newButton
 */

/* Node modules */

/* Third-party modules */
import { RawLocation } from 'vue-router'; // eslint-disable-line import/no-extraneous-dependencies

/* Files */

export interface IButton {
  color: string;
  icon: string;
  dark?: boolean;
  to?: RawLocation;
  display?: (() => boolean) | boolean;
  click?: (e: Event) => void;
}
