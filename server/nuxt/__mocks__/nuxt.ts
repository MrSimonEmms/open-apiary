/**
 * nuxt
 */

/* Node modules */

/* Third-party modules */

/* Files */

export const Builder = jest.fn().mockImplementation(() => ({
  build: jest.fn(),
}));
export const Nuxt = jest.fn().mockImplementation(() => ({
  render: jest.fn(),
}));
