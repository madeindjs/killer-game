import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const Games = sqliteTable("games", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name"),
  startedAt: int("started_at", { mode: "timestamp" }),
  finishedAt: int("finished_at", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: int("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
