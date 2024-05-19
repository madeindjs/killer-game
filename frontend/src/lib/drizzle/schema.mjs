import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { generateSmallUuid } from "../uuid";

export const Games = sqliteTable("games", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateSmallUuid()),
  name: text("name").notNull(),
  privateToken: text("private_token")
    .notNull()
    .$defaultFn(() => generateSmallUuid()),
  startedAt: int("started_at", { mode: "timestamp" }),
  finishedAt: int("finished_at", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: int("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const GameActions = sqliteTable("game_actions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateSmallUuid()),
  name: text("name").notNull(),
  gameId: text("game_id")
    .references(() => Games.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: int("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const Players = sqliteTable("players", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateSmallUuid()),
  name: text("name").notNull(),
  privateToken: text("private_token")
    .notNull()
    .$defaultFn(() => generateSmallUuid()),
  order: int("order").notNull(),
  killedAt: int("killed_at", { mode: "timestamp" }),
  killToken: int("kill_token").$defaultFn(() => Math.round(Math.random() * 100)),
  // TODO: ref
  killedBy: text("killed_by"),

  actionId: text("action_id")
    .references(() => GameActions.id)
    .notNull(),

  gameId: text("game_id")
    .references(() => Games.id, { onDelete: "cascade" })
    .notNull(),

  avatar: text("avatar", { mode: "json" }),

  createdAt: int("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: int("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
