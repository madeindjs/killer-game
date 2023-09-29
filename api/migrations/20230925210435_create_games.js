/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("games", (table) => {
    table.increments("id").primary().notNullable();
    table.text("name");
    table.timestamp("started_at").nullable();
    table.uuid("public_token").unique();
    table.uuid("private_token").unique();
    table.jsonb("actions").defaultTo("[]");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("players", (table) => {
    table.increments("id").primary().notNullable();
    table.text("name");
    table.uuid("public_token").unique();
    table.timestamp("killed_at").nullable();

    table.integer("game_id").unsigned();
    table.foreign("game_id").references("id").inTable("games");
    table.timestamps(true, true);
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
