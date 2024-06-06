import type { Games, Players } from "@/lib/drizzle/schema.mjs";
import type { InferSelectModel } from "drizzle-orm";

export type GameRecord = InferSelectModel<typeof Games>;
export type PlayerRecord = InferSelectModel<typeof Players>;
