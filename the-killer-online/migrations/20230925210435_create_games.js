/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("games", (table) => {
    table.increments("id").primary().notNullable();
    table.text("name");
    table.uuid("public_token").unique();
    table.uuid("private_token").unique();
  });

  await knex.schema.createTable("players", (table) => {
    table.increments("id").primary().notNullable();
    table.text("name");
    table.uuid("public_token").unique();

    table.integer("game_id").unsigned();
    table.foreign("game_id").references("id").inTable("games");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable("games");
  await knex.schema.dropTable("players");
}
