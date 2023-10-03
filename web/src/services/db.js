import knex from "knex";
import configuration from "../../knexfile";

// TODO
export const db = knex(configuration.development);
