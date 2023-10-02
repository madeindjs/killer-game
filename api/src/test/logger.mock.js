const noop = () => {};

/** @type {import('fastify').FastifyBaseLogger} */
export const mockLogger = {
  // @ts-ignore
  child: noop,
  debug: noop,
  error: noop,
  fatal: noop,
  info: noop,
  level: "",
  silent: noop,
  trace: noop,
  warn: noop,
};
