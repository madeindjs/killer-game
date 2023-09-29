/**
 * @typedef PlayerRecord
 * @property {number} id
 * @property {string} name
 * @property {string} public_token
 * @property {number} game_id
 */

/**
 * @typedef GameRecord
 * @property {number} id
 * @property {string} name
 * @property {string} public_token
 * @property {string | string} actions
 * @property {string} private_token
 * @property {string} [started_at]
 */

/**
 * @typedef {GameRecord & {actions: string[]}} Game
 */
