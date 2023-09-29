/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("games", (table) => {
    table.uuid("id").primary().notNullable();
    table.text("name");
    table.timestamp("started_at").nullable();
    table.uuid("private_token").unique();
    table.jsonb("actions").defaultTo("[]");

    table.timestamps(true, true);
  });

  await knex.schema.createTable("game_actions", (table) => {
    table.uuid("id").primary().notNullable();
    table.text("name");

    table.uuid("game_id").unsigned();
    table.foreign("game_id").references("id").inTable("games");

    table.timestamps(true, true);
  });

  await knex.schema.createTable("players", (table) => {
    table.uuid("id").primary().notNullable();
    table.text("name");
    table.uuid("private_token").unique();

    table.timestamp("killed_at").nullable();

    table.uuid("killed_by").unsigned();
    table.foreign("killed_by").references("id").inTable("players");

    table.uuid("action_id").unsigned();
    table.foreign("action_id").references("id").inTable("game_actions");

    table.uuid("game_id").unsigned();
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
  await knex.schema.dropTable("game_actions");
  await knex.schema.dropTable("players");
}
