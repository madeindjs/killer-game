/**
 * @type {import('knex').Knex}
 */
const db = require("knex")({
  client: "better-sqlite3",
  connection: {
    filename: "./db.sqlite",
  },
});
db.on("query", function (queryData) {
  console.log("[knex] %s -- %o", queryData.sql, queryData.bindings);
});

let initialized = false;

/**
 * @returns {import('knex').Knex}
 */
export async function getDb() {
  if (initialized) return db;

  if (!(await db.schema.hasTable("games"))) {
    await db.schema.createTable("games", function (table) {
      table.increments();
      table.string("name");
      table.timestamps();
    });
  }

  if (!(await db.schema.hasTable("players"))) {
    await db.schema.createTable("players", function (table) {
      table.increments();
      table.string("name");
      table.integer("game_id").unsigned().notNullable();
      table.timestamps();

      table.foreign("game_id").references("id").inTable("games");
    });
  }

  initialized = true;

  return db;
}
