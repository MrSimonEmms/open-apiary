/**
 * datetime
 */

/* Node modules */

/* Third-party modules */
import { DateTime, DateTimeFormatOptions } from 'luxon';

/* Files */

export default (value: string | Date, fmt?: string | DateTimeFormatOptions) => {
  let format : DateTimeFormatOptions = DateTime.DATE_SHORT;

  const luxon = (typeof value === 'string') ? DateTime.fromISO(value) : DateTime.fromJSDate(value);

  if (fmt) {
    if (typeof fmt === 'string') {
      if (fmt in DateTime) {
        format = (<any>DateTime)[fmt];
      } else {
        return luxon
          .toFormat(fmt);
      }
    } else {
      format = fmt;
    }
  }

  return luxon
    .toLocaleString(format);
};
