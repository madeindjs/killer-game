/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.table("players", (table) => {
    table.dropForeign("action_id");
    table.dropColumn("action_id");
  });

  await knex.schema.dropTable("game_actions");
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.createTable("game_actions", (table) => {
    table.uuid("id").primary().notNullable();
    table.text("name");

    table.uuid("game_id").unsigned();
    table.foreign("game_id").references("id").inTable("games").onDelete("CASCADE");

    table.timestamps(true, true);
  });
}
