import db from "@/lib/drizzle/database.mjs";
import { GameActions, Games } from "@/lib/drizzle/schema.mjs";
import { generateUuid } from "@/lib/uuid";

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

  const body = await req.json();

  if (body?.["actions"] && Array.isArray(body?.["actions"]) && body?.["actions"].length > 0) {
    const actions = body["actions"].map((action) => ({ name: action.name, gameId: game.id, id: generateUuid() }));
    await db.insert(GameActions).values(actions);
  }

  return Response.json({ data: game });
}
