/**
 * @typedef PlayerRecord
 * @property {string} id
 * @property {string} name
 * @property {string} private_token
 * @property {string} game_id
 * @property {string} action_id
 */

/**
 * @typedef GameRecord
 * @property {string} id
 * @property {string} name
 * @property {string} private_token
 * @property {string} [started_at]
 */

/**
 * @typedef GameActionRecord
 * @property {string} id
 * @property {string} name
 * @property {string} game_id
 */

/**
 * @typedef {GameRecord & {actions: string[]}} GameWithActions
 */
