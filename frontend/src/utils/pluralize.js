/**
 * @param {number} count
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

/**
 * @param {number} count
 * @returns {string}
 */
export const pluralizePlayers = (count) => `${count} ${pluralize(count, "player", "players")}`;

/**
 * @param {number} count
 * @returns {string}
 */
export const pluralizeKills = (count) => `${count} ${pluralize(count, "kill", "kills")}`;
