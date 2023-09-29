import knex from "knex";
import configuration from "../../knexfile.js";

/**
 * @type {import('knex').Knex}
 */
let db;

export function getDb() {
  if (db === undefined) {
    db = knex(configuration.development);
  }

  return db;
}

export const TABLES = { games: "games" };
