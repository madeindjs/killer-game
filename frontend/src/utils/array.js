/**
 * @template T
 * @param {T[]} items
 * @returns {T | undefined}
 */
export function getRandomItemInArray(items) {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}
