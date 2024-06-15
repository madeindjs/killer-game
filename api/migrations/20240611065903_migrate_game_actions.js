/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.table("players", (table) => {
    table.string("action");
  });

  for (const player of await knex("players").select("id", "action_id")) {
    const action = await knex("game_actions").where({ id: player.action_id }).first();
    if (!action) throw Error(`Could not find action ${player.action_id} for player ${player.id}`);
    await knex("players").update({ action: action.name }).where({ id: player.id });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.table("players", (table) => {
    table.dropColumn("action");
  });
}
