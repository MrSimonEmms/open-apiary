/**
 * markdown
 */

/* Node modules */

/* Third-party modules */
import marked from 'marked';

/* Files */

export default (value: string) => {
  if (!value) {
    return '';
  }

  return marked(value, {
    gfm: true,
  });
};
