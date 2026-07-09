import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
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

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("payments");
}