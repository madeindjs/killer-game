/**
 * @template {Function} Callback
 * @param {Callback} func
 * @param {number} waitMs
 * @returns {Callback}
 */
export function debounce(func, waitMs) {
  /** @type {NodeJS.Timeout} */
  let timeout;

  // @ts-ignore
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(undefined, args), waitMs);
  };
}
