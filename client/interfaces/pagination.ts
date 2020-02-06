/**
 * pagination
 */

/* Node modules */

/* Third-party modules */

/* Files */

export interface IPagination<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}
