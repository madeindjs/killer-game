/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("payments", (table) => {
    table.uuid("id").primary().notNullable();
    table.uuid("game_id").notNullable();
    table.foreign("game_id").references("id").inTable("games").onDelete("CASCADE");
    table.text("stripe_session_id").notNullable().unique();
    table.integer("amount_cents").notNullable().defaultTo(0);
    table.text("status").notNullable().defaultTo("pending");
    table.timestamps(true, true);
  });

  await knex.schema.alterTable("payments", (table) => {
    table.index("game_id");
    table.index("stripe_session_id");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable("payments");
}