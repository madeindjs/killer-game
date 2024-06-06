import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { generateSmallUuid } from "../uuid";

export const Games = sqliteTable("games", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateSmallUuid()),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  password: text("password").notNull(),
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

  action: text("action"),

  gameId: text("game_id")
    .references(() => Games.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: int("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: int("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
