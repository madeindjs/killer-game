// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "better-sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./dev.sqlite3",
    },
  },
  test: {
    client: "better-sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: ":memory:",
    },
  },
  staging: {
    client: "better-sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./staging.sqlite3",
    },
  },
  production: {
    client: "better-sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./staging.sqlite3",
    },
  },
};
