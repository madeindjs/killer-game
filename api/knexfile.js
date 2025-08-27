// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./db/dev.sqlite3",
    },
  },
  test: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: ":memory:",
    },
  },
  staging: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./db/stag.sqlite3",
    },
  },
  production: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./db/prod.sqlite3",
    },
  },
};
