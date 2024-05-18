import db from "@/lib/drizzle/database.mjs";
import { GameActions, Games } from "@/lib/drizzle/schema.mjs";

/**
 * @param {Request} request
 */
export async function GET(request) {
  const rows = await db.select().from(Games);

  return Response.json({ data: 1, rows });
}

/**
 * @param {Request} req
 */
export async function POST(req) {
  const [game] = await db
    .insert(Games)
    .values({
      name: "test",
    })
    .returning();

  if (req.body?.["actions"] && Array.isArray(req.body?.["actions"]) && req.body?.["actions"].length > 0) {
    const actions = req.body["actions"].map((actions) => ({ name: action.name, game_id: gameId, id: generateUuid() }));
    await db.insert(GameActions).values(actions);
  }

  return Response.json({ data: game });
}
