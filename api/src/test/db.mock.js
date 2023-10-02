import knex from "knex";
import configuration from "../../knexfile.js";

export async function getMockDB() {
  const db = knex({ ...configuration.test });
  await db.migrate.latest();
  return db;
}
